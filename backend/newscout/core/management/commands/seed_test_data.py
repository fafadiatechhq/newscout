from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from core.models import Article, ArticleTag, Bookmark, Category, Source

DEMO_PASSWORD = "DemoPass123!"
DEMO_USERS = (
    {
        "email": "demo@newscout.app",
        "first_name": "Demo",
        "last_name": "User",
    },
    {
        "email": "reader@newscout.app",
        "first_name": "Reader",
        "last_name": "User",
    },
)

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

# category name, title, author, summary, sources, tags, flags, hours_ago
ARTICLES = (
    (
        "Artificial Intelligence",
        "Open models push new benchmarks in reasoning",
        "Priya Nair",
        "Researchers report open-weight models closing the gap with proprietary systems on multi-step reasoning tasks.",
        ("Tech Wire", "Daily Herald"),
        ("AI", "Science"),
        {"trending": True, "featured": True},
        2,
    ),
    (
        "Artificial Intelligence",
        "Hospital pilots triage chatbot for overnight shifts",
        "James Cole",
        "A regional hospital network is testing an AI assistant that drafts overnight triage notes for nurse review.",
        ("Tech Wire",),
        ("AI", "Health"),
        {"editors_pick": True},
        8,
    ),
    (
        "Startups",
        "Series B round values logistics startup at $1.2B",
        "Amina Okonkwo",
        "A freight-matching platform raised new capital to expand into cold-chain routes across Southeast Asia.",
        ("Market Pulse", "Indie Report"),
        ("Startups", "Markets"),
        {"trending": True},
        5,
    ),
    (
        "Startups",
        "Indie founders ditch growth hacks for retention",
        "Luis Ortega",
        "Operators say paid acquisition costs have forced a return to product-led retention playbooks.",
        ("Indie Report",),
        ("Startups",),
        {},
        30,
    ),
    (
        "Technology",
        "Chipmakers race to secure advanced packaging capacity",
        "Helen Park",
        "Shortages in advanced packaging are emerging as a bottleneck even as wafer fabs expand.",
        ("Tech Wire", "Market Pulse"),
        ("Science", "Markets"),
        {"featured": True},
        12,
    ),
    (
        "Technology",
        "Major breach exposes password vault metadata",
        "Dev Kapoor",
        "Security researchers say attackers stole encrypted vault metadata but not master passwords.",
        ("Daily Herald", "Tech Wire"),
        ("Cybersecurity",),
        {"is_breaking": True, "trending": True},
        1,
    ),
    (
        "Technology",
        "Cities trial privacy-first traffic sensors",
        "Nora Ellis",
        "Municipal pilots replace license-plate cameras with edge devices that only emit aggregated counts.",
        ("Indie Report",),
        ("Science", "Cybersecurity"),
        {},
        48,
    ),
    (
        "Politics",
        "Cabinet debates climate spending bill amendments",
        "Sarah Klein",
        "Lawmakers are negotiating last-minute changes to clean-energy subsidies before a floor vote.",
        ("Policy Brief", "Daily Herald"),
        ("Climate", "Elections"),
        {"featured": True, "editors_pick": True},
        6,
    ),
    (
        "Politics",
        "Opposition leader calls for emergency session",
        "Marcus Reid",
        "The opposition is pressing for a special session after disputed figures in a budget report.",
        ("Policy Brief",),
        ("Elections",),
        {"is_breaking": True},
        3,
    ),
    (
        "Elections",
        "Early voting turnout tops previous midterms",
        "Fatima Hassan",
        "Election officials report record early ballots in several swing districts.",
        ("Daily Herald", "Policy Brief"),
        ("Elections",),
        {"trending": True},
        10,
    ),
    (
        "Elections",
        "Fact-checkers flag viral campaign clip",
        "Owen Blake",
        "A widely shared clip was edited to remove context from a debate exchange, analysts say.",
        ("Indie Report",),
        ("Elections", "Cybersecurity"),
        {},
        20,
    ),
    (
        "Sports",
        "Championship final set after dramatic semi",
        "Carla Mendes",
        "A stoppage-time equalizer forced penalties and sent the underdogs into the final.",
        ("SportCast", "Daily Herald"),
        ("Football",),
        {"trending": True, "featured": True},
        4,
    ),
    (
        "Sports",
        "Star midfielder sidelined for six weeks",
        "Tom Berger",
        "Club medical staff confirmed a hamstring strain after last weekend's derby.",
        ("SportCast",),
        ("Football", "Health"),
        {},
        15,
    ),
    (
        "Sports",
        "League expands streaming package for overseas fans",
        "Rina Sato",
        "A new rights deal will unlock live matches in markets that previously relied on delay feeds.",
        ("SportCast", "Market Pulse"),
        ("Football", "Markets"),
        {"editors_pick": True},
        36,
    ),
    (
        "Business",
        "Central bank holds rates amid sticky inflation",
        "Elena Petrova",
        "Policymakers signaled patience as services inflation remains above target.",
        ("Market Pulse", "Daily Herald"),
        ("Markets",),
        {"featured": True},
        7,
    ),
    (
        "Business",
        "Retail giant spins off logistics arm",
        "Chris Alvarez",
        "The demerger aims to unlock value as third-party fulfillment demand grows.",
        ("Market Pulse",),
        ("Markets", "Startups"),
        {"trending": True},
        18,
    ),
    (
        "Business",
        "Green bonds see record quarterly issuance",
        "Mei Lin",
        "Investors piled into climate-linked debt as yields compressed versus vanilla corporates.",
        ("Market Pulse", "Policy Brief"),
        ("Markets", "Climate"),
        {},
        42,
    ),
    (
        "Business",
        "Airline group warns of summer capacity squeeze",
        "Jon Hale",
        "Carriers say engine maintenance backlogs could cut available seats on busy routes.",
        ("Daily Herald",),
        ("Markets",),
        {"is_breaking": True},
        9,
    ),
    (
        "Entertainment",
        "Indie film takes top prize at spring festival",
        "Zoe Martin",
        "A low-budget drama about migrant workers won the jury's unanimous vote.",
        ("Culture Desk", "Indie Report"),
        ("Cinema",),
        {"editors_pick": True, "featured": True},
        14,
    ),
    (
        "Entertainment",
        "Streaming service greenlights sci-fi anthology",
        "Kenji Morimoto",
        "The series will pair emerging directors with short speculative scripts each season.",
        ("Culture Desk", "Tech Wire"),
        ("Cinema", "AI"),
        {},
        22,
    ),
    (
        "Entertainment",
        "Chart-topping album returns after remaster",
        "Amelia Frost",
        "Fans rushed a remastered anniversary edition that restores original session takes.",
        ("Culture Desk",),
        ("Cinema",),
        {"trending": True},
        28,
    ),
    (
        "Entertainment",
        "Studio pauses sequel after script rewrite",
        "Victor Ng",
        "Production is on hold while writers rework the third act following test-screening notes.",
        ("Culture Desk", "Daily Herald"),
        ("Cinema",),
        {},
        55,
    ),
    (
        "Artificial Intelligence",
        "Regulators propose labels for synthetic media",
        "Ivy Chen",
        "Draft rules would require platforms to disclose AI-generated images and audio in political ads.",
        ("Policy Brief", "Tech Wire"),
        ("AI", "Elections", "Cybersecurity"),
        {"is_breaking": True, "editors_pick": True},
        0,
    ),
    (
        "Technology",
        "Open-source maintainers win new funding grant",
        "Sam Rivera",
        "A foundation grant will pay maintainers of critical infrastructure libraries for two years.",
        ("Tech Wire", "Indie Report"),
        ("Startups", "Science"),
        {},
        60,
    ),
)


class Command(BaseCommand):
    help = (
        "Seed a fixed set of categories, sources, tags, articles, demo users, "
        "and bookmarks for local development."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help=(
                "Delete existing bookmarks, articles, tags, sources, and "
                "categories before seeding. Demo users are kept and updated."
            ),
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["clear"]:
            self._clear()

        categories = self._seed_categories()
        sources = self._seed_sources()
        tags = self._seed_tags()
        articles = self._seed_articles(categories, sources, tags)
        users = self._seed_users()
        bookmarks = self._seed_bookmarks(users, articles)

        self.stdout.write(self.style.SUCCESS("Seed complete."))
        self.stdout.write(
            f"  Categories: {Category.objects.count()}  "
            f"Sources: {Source.objects.count()}  "
            f"Tags: {ArticleTag.objects.count()}  "
            f"Articles: {Article.objects.count()}  "
            f"Bookmarks: {Bookmark.objects.count()}"
        )
        self.stdout.write("Demo logins (password for both):")
        self.stdout.write(f"  {DEMO_PASSWORD}")
        for user in users:
            self.stdout.write(f"  {user.email}")
        self.stdout.write(
            f"Created/updated this run: "
            f"{len(categories)} categories, {len(sources)} sources, "
            f"{len(tags)} tags, {len(articles)} articles, "
            f"{len(users)} users, {len(bookmarks)} bookmarks."
        )

    def _clear(self):
        deleted_bookmarks, _ = Bookmark.objects.all().delete()
        deleted_articles, _ = Article.objects.all().delete()
        deleted_tags, _ = ArticleTag.objects.all().delete()
        deleted_sources, _ = Source.objects.all().delete()
        deleted_categories, _ = Category.objects.all().delete()
        self.stdout.write(
            self.style.WARNING(
                "Cleared existing data: "
                f"{deleted_bookmarks} bookmarks, {deleted_articles} articles, "
                f"{deleted_tags} tags, {deleted_sources} sources, "
                f"{deleted_categories} categories."
            )
        )

    def _seed_categories(self):
        categories = {}
        for data in CATEGORIES:
            category, _ = Category.objects.update_or_create(
                name=data["name"],
                parent=None,
                defaults={
                    "description": data["description"],
                    "popular": data["popular"],
                },
            )
            categories[category.name] = category
            for child in data["children"]:
                child_category, _ = Category.objects.update_or_create(
                    name=child["name"],
                    parent=category,
                    defaults={
                        "description": child["description"],
                        "popular": child["popular"],
                    },
                )
                categories[child_category.name] = child_category
        return categories

    def _seed_sources(self):
        sources = {}
        for data in SOURCES:
            source, _ = Source.objects.update_or_create(
                name=data["name"],
                defaults={
                    "url": data["url"],
                    "logo_url": data["logo_url"],
                    "is_verified": data["is_verified"],
                },
            )
            sources[source.name] = source
        return sources

    def _seed_tags(self):
        tags = {}
        for name in TAGS:
            tag, _ = ArticleTag.objects.get_or_create(name=name)
            tags[name] = tag
        return tags

    def _seed_articles(self, categories, sources, tags):
        now = timezone.now()
        articles = []
        for (
            category_name,
            title,
            author,
            summary,
            source_names,
            tag_names,
            flags,
            hours_ago,
        ) in ARTICLES:
            article, _ = Article.objects.update_or_create(
                title=title,
                defaults={
                    "author": author,
                    "summary": summary,
                    "content_url": (
                        f"https://news.example.com/articles/"
                        f"{title.lower().replace(' ', '-')[:80]}"
                    ),
                    "category": categories[category_name],
                    "published_at": now - timedelta(hours=hours_ago),
                    "image_url": (
                        "https://picsum.photos/seed/"
                        f"{title.lower().replace(' ', '-')[:40]}/800/450"
                    ),
                    "trending": flags.get("trending", False),
                    "featured": flags.get("featured", False),
                    "editors_pick": flags.get("editors_pick", False),
                    "is_breaking": flags.get("is_breaking", False),
                },
            )
            article.source.set(sources[name] for name in source_names)
            article.tags.set(tags[name] for name in tag_names)
            articles.append(article)
        return articles

    def _seed_users(self):
        users = []
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

    def _seed_bookmarks(self, users, articles):
        demo_user, reader_user = users
        # Prefer variety: breaking/trending first when available
        demo_targets = articles[:5]
        reader_targets = articles[5:7]

        bookmarks = []
        for user, targets in (
            (demo_user, demo_targets),
            (reader_user, reader_targets),
        ):
            for article in targets:
                bookmark, _ = Bookmark.objects.get_or_create(
                    user=user,
                    article=article,
                )
                bookmarks.append(bookmark)
        return bookmarks
