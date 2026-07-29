"""
Management command: seed_test_data
===================================
Populates the database with realistic-looking fake data for local development
and integration testing.

Article generation strategy
----------------------------
* Categories, sources, and tags are seeded from fixed domain constants so
  the data remains structurally coherent across runs.
* Article **titles** are assembled from category-specific (subject, verb,
  object) phrase banks — plain Faker sentences don't read like news
  headlines.
* Article **authors** and **summaries** are produced by Faker so they vary
  between runs (unless you pin the seed).
* Articles are distributed across three time buckets:
    - "now"   (0 – 6 h ago)   — 15 % of total, 50 % trending
    - "today" (6 – 24 h ago)  — 30 % of total, 35 % trending
    - "week"  (24 – 168 h ago) — 55 % of total, 20 % trending
  This ensures the Flutter trending-screen period chips all have content.
* Boolean flags (featured, editors_pick, is_breaking) are assigned by
  independent Bernoulli draws so combinations occur naturally.

Usage
-----
    python manage.py seed_test_data               # 80 articles, seed 0
    python manage.py seed_test_data --count 200   # more data
    python manage.py seed_test_data --seed 99     # different names/summaries
    python manage.py seed_test_data --clear       # wipe first, then seed
"""
import math
import random
from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from faker import Faker

from core.models import Article, ArticleTag, Bookmark, Category, Source

# ── Demo users ────────────────────────────────────────────────────────────────

DEMO_PASSWORD = "DemoPass123!"
DEMO_USERS = (
    {"email": "demo@newscout.app", "first_name": "Demo", "last_name": "User"},
    {"email": "reader@newscout.app", "first_name": "Reader", "last_name": "User"},
)

# ── Domain constants — kept fixed for structural coherence ────────────────────

CATEGORIES = (
    {
        "name": "Technology",
        "description": "Gadgets, software, and the digital world",
        "popular": True,
        "children": (
            {
                "name": "Artificial Intelligence",
                "description": "Machine learning and AI research",
                "popular": True,
            },
            {
                "name": "Startups",
                "description": "Funding rounds and founder stories",
                "popular": False,
            },
        ),
    },
    {
        "name": "Politics",
        "description": "Elections, policy, and government",
        "popular": True,
        "children": (
            {
                "name": "Elections",
                "description": "Campaigns and voting coverage",
                "popular": False,
            },
        ),
    },
    {
        "name": "Sports",
        "description": "Scores, transfers, and match analysis",
        "popular": False,
        "children": (),
    },
    {
        "name": "Business",
        "description": "Markets, companies, and the economy",
        "popular": True,
        "children": (),
    },
    {
        "name": "Entertainment",
        "description": "Film, music, and pop culture",
        "popular": False,
        "children": (),
    },
)

SOURCES = (
    {
        "name": "Daily Herald",
        "url": "https://dailyherald.example.com",
        "logo_url": "https://picsum.photos/seed/dailyherald/64",
        "is_verified": True,
    },
    {
        "name": "Tech Wire",
        "url": "https://techwire.example.com",
        "logo_url": "https://picsum.photos/seed/techwire/64",
        "is_verified": True,
    },
    {
        "name": "Market Pulse",
        "url": "https://marketpulse.example.com",
        "logo_url": "https://picsum.photos/seed/marketpulse/64",
        "is_verified": True,
    },
    {
        "name": "SportCast",
        "url": "https://sportcast.example.com",
        "logo_url": "https://picsum.photos/seed/sportcast/64",
        "is_verified": False,
    },
    {
        "name": "Culture Desk",
        "url": "https://culturedesk.example.com",
        "logo_url": "https://picsum.photos/seed/culturedesk/64",
        "is_verified": False,
    },
    {
        "name": "Policy Brief",
        "url": "https://policybrief.example.com",
        "logo_url": "https://picsum.photos/seed/policybrief/64",
        "is_verified": True,
    },
    {
        "name": "Indie Report",
        "url": "https://indiereport.example.com",
        "logo_url": "https://picsum.photos/seed/indiereport/64",
        "is_verified": False,
    },
)

TAGS = (
    "AI",
    "Climate",
    "Markets",
    "Elections",
    "Football",
    "Cinema",
    "Cybersecurity",
    "Startups",
    "Health",
    "Science",
)

# ── Category-aware headline phrase banks ──────────────────────────────────────
# Each phrase is a (subject, verb, object) triple so headlines read naturally.
# Categories without an entry fall back to FALLBACK_PHRASES.

CATEGORY_PHRASES: dict[str, list[tuple[str, str, str]]] = {
    "Artificial Intelligence": [
        ("Open-source models", "push new benchmarks in", "multi-step reasoning"),
        ("Hospital network", "pilots AI chatbot for", "overnight triage shifts"),
        ("Regulators", "propose mandatory labels for", "synthetic media"),
        ("AI labs", "release joint safety framework for", "frontier models"),
        ("Researchers", "achieve breakthrough in", "protein structure prediction"),
        ("Startups", "race to deploy AI across", "clinical workflows"),
        ("Tech firms", "face scrutiny over", "AI bias in hiring tools"),
        ("Open models", "close gap with", "proprietary systems on code tasks"),
        ("Government panel", "recommends audit regime for", "high-risk AI systems"),
        ("Foundation model", "sets new record on", "mathematical reasoning benchmarks"),
        ("Researchers", "warn of", "emergent deception in large language models"),
        ("Cloud providers", "offer subsidised compute for", "AI safety research"),
    ],
    "Startups": [
        ("Series B round", "values logistics startup at", "$1.2 B"),
        ("Indie founders", "ditch growth hacks for", "retention-first playbooks"),
        ("Accelerator cohort", "backs ten startups building in", "climate tech"),
        ("VC firm", "leads $200 M round in", "B2B payments startup"),
        ("Founders", "pivot from consumer to", "enterprise sales model"),
        ("Pre-seed startup", "raises $5 M to tackle", "healthcare data interop"),
        ("SaaS startup", "hits $10 M ARR with", "zero paid marketing spend"),
        ("Robotics startup", "ships first commercial unit to", "warehouse operators"),
        ("Edtech founder", "returns funding after", "product-market fit pivot"),
        ("Fintech startup", "secures banking licence to", "expand lending arm"),
        ("Climate startup", "closes $80 M Series A for", "direct air-capture pilot"),
    ],
    "Technology": [
        ("Chipmakers", "race to secure", "advanced packaging capacity"),
        ("Major breach", "exposes", "password vault metadata"),
        ("Cities", "trial privacy-first", "traffic sensor network"),
        ("Open-source maintainers", "win foundation grant for", "critical libraries"),
        ("Quantum startup", "raises $500 M to build", "first commercial processor"),
        ("Semiconductor giants", "announce joint roadmap to", "1 nm chips by 2027"),
        ("Browser vendors", "drop support for", "legacy TLS handshake"),
        ("Researchers", "demonstrate", "energy-efficient neuromorphic chip"),
        ("Data-centre operators", "adopt liquid cooling to", "cut power consumption"),
        ("Open-source ecosystem", "splits over", "licence compatibility dispute"),
        ("Security firm", "discloses", "critical zero-day in popular VPN client"),
        ("Satellite network", "achieves", "global low-latency coverage milestone"),
        ("Mobile OS update", "introduces", "default end-to-end encryption for SMS"),
    ],
    "Politics": [
        ("Cabinet", "debates", "climate spending bill amendments"),
        ("Opposition leader", "calls for", "emergency legislative session"),
        ("Senate panel", "advances", "digital privacy reform bill"),
        ("Ministers", "clash over", "immigration policy overhaul"),
        ("Coalition government", "survives", "confidence vote by narrow margin"),
        ("Ruling party", "faces backlash over", "austerity budget proposals"),
        ("Cross-party group", "urges", "faster ratification of trade treaty"),
        ("Government", "announces", "new industrial strategy for green transition"),
        ("Prime minister", "reshuffles cabinet following", "election setback"),
        ("Parliament", "passes landmark", "online safety legislation"),
        ("Inquiry report", "finds systemic failures in", "public health response"),
    ],
    "Elections": [
        ("Early voting turnout", "tops", "previous midterm records"),
        ("Fact-checkers", "flag", "viral campaign clip for missing context"),
        ("Election officials", "report record ballots in", "key swing districts"),
        ("Candidate", "surges in polls after", "televised debate performance"),
        ("Campaign finance filings", "reveal", "record super-PAC spending"),
        ("Federal court", "blocks", "voter ID law before primary"),
        ("Third-party candidate", "draws", "double-digit support in new poll"),
        ("Polling firm", "projects", "record youth turnout in upcoming election"),
        ("Incumbent", "loses primary to", "insurgent challenger"),
        ("Recount demanded after", "margin of", "fewer than 200 votes confirmed"),
        ("International observers", "raise concerns over", "ballot-counting transparency"),
    ],
    "Sports": [
        ("Championship final", "set after", "dramatic semi-final penalties"),
        ("Star midfielder", "sidelined for", "six weeks with hamstring strain"),
        ("League", "expands streaming package for", "overseas fans"),
        ("Club", "breaks transfer record to sign", "Argentine playmaker"),
        ("Underdogs", "shock title holders in", "opening-round cup upset"),
        ("National team", "qualifies for", "World Cup after playoff win"),
        ("Governing body", "suspends player for", "doping violation"),
        ("Stadium", "unveils plans for", "net-zero carbon renovation"),
        ("Record crowd", "watches", "historic rivalry rematch"),
        ("Women's league", "secures", "landmark equal-pay broadcast deal"),
        ("Marathon runner", "breaks", "course record in ideal conditions"),
        ("Youth academy", "produces", "three first-team debutants in one match"),
    ],
    "Business": [
        ("Central bank", "holds rates amid", "sticky inflation concerns"),
        ("Retail giant", "spins off", "logistics arm"),
        ("Green bonds", "see record", "quarterly issuance globally"),
        ("Airline group", "warns of", "summer capacity squeeze"),
        ("Electric vehicle sales", "surpass petrol in", "key European markets"),
        ("Private equity firm", "acquires", "regional media group"),
        ("Supply chain disruption", "forces", "factory output cuts across Asia"),
        ("Sovereign wealth fund", "increases stake in", "emerging market equities"),
        ("Merger talks collapse as", "antitrust regulator", "blocks deal"),
        ("Profit warning", "sends shares lower at", "consumer goods group"),
        ("Hedge fund", "discloses short position against", "overvalued tech index"),
        ("IPO market", "reopens with", "oversubscribed listing in financial sector"),
        ("Trade deficit narrows as", "export demand", "recovers in Asia"),
    ],
    "Entertainment": [
        ("Indie film", "takes top prize at", "spring festival"),
        ("Streaming service", "greenlights", "sci-fi anthology series"),
        ("Studio", "pauses sequel after", "test-screening script rewrite"),
        ("Chart-topping album", "returns after", "anniversary remaster"),
        ("Cannes winner", "heads to", "Netflix after festival run"),
        ("Award show ratings", "hit", "decade-low viewership"),
        ("Broadway season", "opens with", "record advance ticket sales"),
        ("Director", "announces", "return to independent cinema"),
        ("Video game adaptation", "breaks", "streaming premiere viewership record"),
        ("Music label", "signs", "viral social-media artist to major deal"),
        ("Documentary", "exposes", "toxic culture inside talent agency"),
        ("Reboot series", "divides fans after", "first-episode leak"),
    ],
}

FALLBACK_PHRASES: list[tuple[str, str, str]] = [
    ("Industry leaders", "meet to discuss", "emerging policy changes"),
    ("Analysts", "report", "record activity in key sector"),
    ("Experts", "warn of", "growing risks in global markets"),
    ("Officials", "confirm", "new measures to address systemic risk"),
    ("Report finds", "significant gaps in", "current regulatory framework"),
]

# Tags that are plausible for each top-level category (helps sample realistic tag combos)
CATEGORY_TAGS: dict[str, list[str]] = {
    "Technology": ["AI", "Cybersecurity", "Science", "Startups"],
    "Artificial Intelligence": ["AI", "Science", "Cybersecurity", "Health"],
    "Startups": ["Startups", "Markets", "AI"],
    "Politics": ["Climate", "Elections", "Markets"],
    "Elections": ["Elections", "Cybersecurity"],
    "Sports": ["Football", "Health"],
    "Business": ["Markets", "Climate", "Startups"],
    "Entertainment": ["Cinema"],
}

# ── Time-bucket configuration ─────────────────────────────────────────────────

# (label, min_hours_ago, max_hours_ago, fraction_of_total, trending_probability)
TIME_BUCKETS = [
    ("now",   0,   6,   0.15, 0.50),
    ("today", 6,   24,  0.30, 0.35),
    ("week",  24,  168, 0.55, 0.20),
]

# Independent probabilities for the other boolean flags
FLAG_PROBS = {
    "featured":    0.20,
    "editors_pick": 0.12,
    "is_breaking": 0.10,
}


# ── Helpers ───────────────────────────────────────────────────────────────────

def _headline(category_name: str, used: set[str]) -> str:
    """
    Pick an unused (subject, verb, object) phrase for *category_name* and
    return a formatted headline string.  Once all phrases are exhausted, cycle
    back through them with a numeric suffix to keep titles unique.
    """
    phrases = CATEGORY_PHRASES.get(category_name, FALLBACK_PHRASES)
    # Separate unused from used so we prefer fresh phrases
    unused = [p for p in phrases if f"{category_name}:{p}" not in used]
    pool = unused if unused else phrases
    subj, verb, obj = random.choice(pool)
    title = f"{subj} {verb} {obj}"
    # If the exact title is already taken, append a cycle counter
    attempt = title
    counter = 2
    while attempt in used:
        attempt = f"{title} ({counter})"
        counter += 1
    used.add(f"{category_name}:{(subj, verb, obj)}")
    used.add(attempt)
    return attempt


def _image_url(title: str) -> str:
    slug = title.lower().replace(" ", "-")[:40].rstrip("-")
    return f"https://picsum.photos/seed/{slug}/800/450"


def _content_url(title: str) -> str:
    slug = title.lower().replace(" ", "-")[:80].rstrip("-")
    return f"https://news.example.com/articles/{slug}"


class Command(BaseCommand):
    help = (
        "Seed the database with programmatically generated fake data for "
        "local development.  Uses Faker for realistic author names and "
        "article summaries; category-specific phrase banks for headlines."
    )

    DEFAULT_COUNT = 80

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help=(
                "Delete existing bookmarks, articles, tags, sources, and "
                "categories before seeding.  Demo users are kept and updated."
            ),
        )
        parser.add_argument(
            "--count",
            type=int,
            default=self.DEFAULT_COUNT,
            metavar="N",
            help=f"Number of articles to generate (default: {self.DEFAULT_COUNT}).",
        )
        parser.add_argument(
            "--seed",
            type=int,
            default=0,
            metavar="S",
            help=(
                "Integer seed for Faker and random to make output deterministic "
                "(default: 0).  Change to get different names and summaries."
            ),
        )

    @transaction.atomic
    def handle(self, *args, **options):
        count = options["count"]
        rng_seed = options["seed"]

        # Initialise RNGs before any generation so output is reproducible.
        random.seed(rng_seed)
        fake = Faker()
        fake.seed_instance(rng_seed)

        if options["clear"]:
            self._clear()

        categories = self._seed_categories()
        sources = self._seed_sources()
        tags = self._seed_tags()
        articles = self._seed_articles(count, fake, categories, sources, tags)
        users = self._seed_users(fake)
        bookmarks = self._seed_bookmarks(users, articles)

        self.stdout.write(self.style.SUCCESS("Seed complete."))
        self.stdout.write(
            f"  Categories : {Category.objects.count()}  "
            f"Sources : {Source.objects.count()}  "
            f"Tags : {ArticleTag.objects.count()}  "
            f"Articles : {Article.objects.count()}  "
            f"Bookmarks : {Bookmark.objects.count()}"
        )
        self.stdout.write("Demo logins (same password for both accounts):")
        self.stdout.write(f"  password : {DEMO_PASSWORD}")
        for user in users:
            self.stdout.write(f"  email    : {user.email}")
        self.stdout.write(
            f"Created/updated this run: "
            f"{len(categories)} categories, {len(sources)} sources, "
            f"{len(tags)} tags, {len(articles)} articles, "
            f"{len(users)} users, {len(bookmarks)} bookmarks."
        )

    # ── Private helpers ───────────────────────────────────────────────────────

    def _clear(self):
        b, _ = Bookmark.objects.all().delete()
        a, _ = Article.objects.all().delete()
        t, _ = ArticleTag.objects.all().delete()
        s, _ = Source.objects.all().delete()
        c, _ = Category.objects.all().delete()
        self.stdout.write(
            self.style.WARNING(
                f"Cleared: {b} bookmarks, {a} articles, "
                f"{t} tags, {s} sources, {c} categories."
            )
        )

    def _seed_categories(self) -> dict[str, Category]:
        categories: dict[str, Category] = {}
        for data in CATEGORIES:
            cat, _ = Category.objects.update_or_create(
                name=data["name"],
                parent=None,
                defaults={
                    "description": data["description"],
                    "popular": data["popular"],
                },
            )
            categories[cat.name] = cat
            for child in data["children"]:
                child_cat, _ = Category.objects.update_or_create(
                    name=child["name"],
                    parent=cat,
                    defaults={
                        "description": child["description"],
                        "popular": child["popular"],
                    },
                )
                categories[child_cat.name] = child_cat
        return categories

    def _seed_sources(self) -> dict[str, Source]:
        sources: dict[str, Source] = {}
        for data in SOURCES:
            src, _ = Source.objects.update_or_create(
                name=data["name"],
                defaults={
                    "url": data["url"],
                    "logo_url": data["logo_url"],
                    "is_verified": data["is_verified"],
                },
            )
            sources[src.name] = src
        return sources

    def _seed_tags(self) -> dict[str, ArticleTag]:
        tags: dict[str, ArticleTag] = {}
        for name in TAGS:
            tag, _ = ArticleTag.objects.get_or_create(name=name)
            tags[name] = tag
        return tags

    def _seed_articles(
        self,
        total: int,
        fake: Faker,
        categories: dict[str, Category],
        sources: dict[str, Source],
        tags: dict[str, ArticleTag],
    ) -> list[Article]:
        """
        Generate *total* articles distributed across time buckets with
        controlled trending density.  Titles are kept unique within the run;
        update_or_create on title keeps re-runs idempotent.
        """
        now = timezone.now()
        source_list = list(sources.values())
        tag_list = list(tags.values())
        category_names = list(categories.keys())

        # Build per-bucket counts, ensuring every bucket has at least a few rows.
        bucket_counts = []
        remaining = total
        for i, (label, lo, hi, frac, _trending_prob) in enumerate(TIME_BUCKETS):
            if i < len(TIME_BUCKETS) - 1:
                n = max(4, math.floor(total * frac))
                remaining -= n
            else:
                n = max(4, remaining)
            bucket_counts.append(n)

        articles: list[Article] = []
        used_titles: set[str] = set()

        for (label, lo, hi, _frac, trending_prob), bucket_n in zip(
            TIME_BUCKETS, bucket_counts
        ):
            for _ in range(bucket_n):
                cat_name = random.choice(category_names)
                title = _headline(cat_name, used_titles)
                author = fake.name()
                summary = fake.paragraph(nb_sentences=3)

                # Timestamp: uniformly random within this bucket
                hours_ago = random.uniform(lo, hi)
                published_at = now - timedelta(hours=hours_ago)

                # Flags
                trending = random.random() < trending_prob
                featured = random.random() < FLAG_PROBS["featured"]
                editors_pick = random.random() < FLAG_PROBS["editors_pick"]
                # Breaking news: only applies to very recent articles
                is_breaking = (lo < 6) and (random.random() < FLAG_PROBS["is_breaking"])

                # Sources: 1–3 random sources
                article_sources = random.sample(source_list, k=random.randint(1, min(3, len(source_list))))

                # Tags: 1–3 plausible tags for this category
                plausible_tag_names = CATEGORY_TAGS.get(cat_name, list(tags.keys()))
                eligible_tags = [tags[n] for n in plausible_tag_names if n in tags]
                if not eligible_tags:
                    eligible_tags = tag_list
                article_tags = random.sample(eligible_tags, k=random.randint(1, min(3, len(eligible_tags))))

                article, _ = Article.objects.update_or_create(
                    title=title,
                    defaults={
                        "author": author,
                        "summary": summary,
                        "content_url": _content_url(title),
                        "category": categories[cat_name],
                        "published_at": published_at,
                        "image_url": _image_url(title),
                        "trending": trending,
                        "featured": featured,
                        "editors_pick": editors_pick,
                        "is_breaking": is_breaking,
                    },
                )
                article.source.set(article_sources)
                article.tags.set(article_tags)
                articles.append(article)

        return articles

    def _seed_users(self, fake: Faker) -> list[User]:
        users: list[User] = []
        for data in DEMO_USERS:
            email = data["email"]
            user = User.objects.filter(email=email).first()
            if user is None:
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=DEMO_PASSWORD,
                    first_name=data["first_name"],
                    last_name=data["last_name"],
                )
            else:
                user.username = email
                user.first_name = data["first_name"]
                user.last_name = data["last_name"]
                user.set_password(DEMO_PASSWORD)
                user.save()
            users.append(user)
        return users

    def _seed_bookmarks(
        self, users: list[User], articles: list[Article]
    ) -> list[Bookmark]:
        demo_user, reader_user = users[0], users[1]

        # Give the demo user the first 8 articles, reader user the next 3.
        demo_targets = articles[:8]
        reader_targets = articles[8:11]

        bookmarks: list[Bookmark] = []
        for user, targets in (
            (demo_user, demo_targets),
            (reader_user, reader_targets),
        ):
            for article in targets:
                bm, _ = Bookmark.objects.get_or_create(user=user, article=article)
                bookmarks.append(bm)
        return bookmarks
