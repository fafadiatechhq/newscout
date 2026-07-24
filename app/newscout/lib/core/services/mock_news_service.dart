import 'package:flutter/material.dart';

import '../models/article.dart';
import '../models/category.dart';
import 'news_service.dart';

/// Mock implementation of NewsService with hardcoded data.
/// Replace with ApiNewsService once the Django backend is available.
class MockNewsService implements NewsService {
  static final _now = DateTime.now();

  // ── Categories ────────────────────────────────────────────────────────────

  // Brand colour reused for all cards — swap per-category tints here if needed.
  static const _brandTeal = Color(0xFF2E7D7D);

  static final List<NewsCategory> _categories = [
    const NewsCategory(
      id: 'trending',
      name: 'Trending',
      icon: Icons.trending_up,
      color: _brandTeal,
    ),
    const NewsCategory(
      id: 'sector_update',
      name: 'Sector Update',
      icon: Icons.public,
      color: _brandTeal,
    ),
    const NewsCategory(
      id: 'regional_update',
      name: 'Regional Update',
      icon: Icons.language,
      color: _brandTeal,
    ),
    const NewsCategory(
      id: 'finance',
      name: 'Finance',
      icon: Icons.storage,
      color: _brandTeal,
    ),
    const NewsCategory(
      id: 'economics',
      name: 'Economics',
      icon: Icons.bar_chart,
      color: _brandTeal,
    ),
    const NewsCategory(
      id: 'misc',
      name: 'Misc',
      icon: Icons.developer_board,
      color: _brandTeal,
    ),
    const NewsCategory(
      id: 'rss',
      name: 'RSS',
      icon: Icons.rss_feed,
      color: _brandTeal,
    ),
  ];

  // ── Articles ──────────────────────────────────────────────────────────────

  static final List<Article> _articles = [
    // Technology
    Article(
      id: 'tech-1',
      title: 'AI Models Achieve Human-Level Performance on Complex Reasoning Tasks',
      summary:
          'New benchmark results show that the latest generation of large language models can now solve multi-step reasoning problems at a level comparable to expert humans, marking a significant milestone in AI development.',
      imageUrl: 'https://picsum.photos/seed/tech1/800/450',
      source: 'TechCrunch',
      url: 'https://techcrunch.com',
      categoryId: 'sector_update',
      publishedAt: _now.subtract(const Duration(hours: 1)),
      isBreaking: true,
      readTimeMinutes: 5,
      clusterSources: const [
        ArticleSource(name: 'Wired', url: 'https://wired.com'),
        ArticleSource(name: 'Reuters', url: 'https://reuters.com'),
        ArticleSource(name: 'The Guardian', url: 'https://theguardian.com'),
        ArticleSource(name: 'Bloomberg', url: 'https://bloomberg.com'),
      ],
    ),
    Article(
      id: 'tech-2',
      title: 'Apple Vision Pro 2 Rumoured to Feature All-Day Battery Life',
      summary:
          'Sources close to Apple supply chain report that the next generation of the spatial computing headset will include a significantly improved battery system, addressing one of the biggest criticisms of the original model.',
      imageUrl: 'https://picsum.photos/seed/tech2/800/450',
      source: 'The Verge',
      url: 'https://theverge.com',
      categoryId: 'sector_update',
      publishedAt: _now.subtract(const Duration(hours: 3)),
      readTimeMinutes: 4,
    ),
    Article(
      id: 'tech-3',
      title: 'Google DeepMind Achieves New Milestone in Protein Structure Prediction',
      summary:
          'Researchers have used deep learning to accurately predict the 3D structure of previously unknown proteins, potentially accelerating drug discovery and our understanding of disease mechanisms.',
      imageUrl: 'https://picsum.photos/seed/tech3/800/450',
      source: 'MIT Technology Review',
      url: 'https://technologyreview.com',
      categoryId: 'sector_update',
      publishedAt: _now.subtract(const Duration(hours: 6)),
      readTimeMinutes: 6,
    ),
    Article(
      id: 'tech-4',
      title: 'Open Source LLM Surpasses GPT-4 in Code Generation Benchmarks',
      summary:
          'A new open-weight model trained on curated programming datasets has outperformed commercial offerings on standard code generation and debugging tasks, democratising access to high-quality AI coding assistance.',
      imageUrl: 'https://picsum.photos/seed/tech4/800/450',
      source: 'Hacker News',
      url: 'https://news.ycombinator.com',
      categoryId: 'sector_update',
      publishedAt: _now.subtract(const Duration(hours: 8)),
      readTimeMinutes: 3,
    ),

    // World
    Article(
      id: 'world-1',
      title: 'Historic Climate Summit Reaches Agreement on Carbon Neutrality by 2040',
      summary:
          'Over 150 nations signed the landmark accord, pledging to achieve net-zero carbon emissions a decade ahead of previous targets, with a new funding mechanism to support developing nations in the transition.',
      imageUrl: 'https://picsum.photos/seed/world1/800/450',
      source: 'Reuters',
      url: 'https://reuters.com',
      categoryId: 'regional_update',
      publishedAt: _now.subtract(const Duration(hours: 2)),
      isBreaking: true,
      readTimeMinutes: 5,
      clusterSources: const [
        ArticleSource(name: 'BBC News', url: 'https://bbc.com/news'),
        ArticleSource(name: 'Al Jazeera', url: 'https://aljazeera.com'),
        ArticleSource(name: 'Financial Times', url: 'https://ft.com'),
      ],
    ),
    Article(
      id: 'world-2',
      title: 'Global Leaders Convene in Geneva for Annual Economic Forum',
      summary:
          'Finance ministers and central bank governors from the G20 are meeting to discuss coordinated policy responses to emerging economic headwinds, including supply chain resilience and currency volatility.',
      imageUrl: 'https://picsum.photos/seed/world2/800/450',
      source: 'BBC News',
      url: 'https://bbc.com/news',
      categoryId: 'regional_update',
      publishedAt: _now.subtract(const Duration(hours: 4)),
      readTimeMinutes: 4,
    ),
    Article(
      id: 'world-3',
      title: 'Peace Talks Resume as International Mediators Step In',
      summary:
          'After months of stalled negotiations, international mediators have brokered a new framework for dialogue, with both parties agreeing to a 72-hour ceasefire as a confidence-building measure.',
      imageUrl: 'https://picsum.photos/seed/world3/800/450',
      source: 'Al Jazeera',
      url: 'https://aljazeera.com',
      categoryId: 'regional_update',
      publishedAt: _now.subtract(const Duration(hours: 7)),
      readTimeMinutes: 5,
    ),

    // Business
    Article(
      id: 'biz-1',
      title: 'Federal Reserve Signals Rate Cuts in Second Half of 2025',
      summary:
          'Fed Chair Jerome Powell indicated in congressional testimony that the central bank is prepared to ease monetary policy if inflation continues its downward trend, sending equity markets sharply higher.',
      imageUrl: 'https://picsum.photos/seed/biz1/800/450',
      source: 'Financial Times',
      url: 'https://ft.com',
      categoryId: 'finance',
      publishedAt: _now.subtract(const Duration(hours: 2, minutes: 30)),
      isBreaking: true,
      readTimeMinutes: 4,
      clusterSources: const [
        ArticleSource(name: 'Bloomberg', url: 'https://bloomberg.com'),
        ArticleSource(name: 'Reuters', url: 'https://reuters.com'),
        ArticleSource(name: 'CNBC', url: 'https://cnbc.com'),
        ArticleSource(name: 'Wall Street Journal', url: 'https://wsj.com'),
        ArticleSource(name: 'The Economist', url: 'https://economist.com'),
      ],
    ),
    Article(
      id: 'biz-2',
      title: 'Amazon Expands Prime Benefits with New Healthcare and Wellness Features',
      summary:
          'The e-commerce giant is rolling out telehealth consultations, prescription drug discounts, and mental health resources to Prime members in all 50 US states, intensifying competition with traditional health insurers.',
      imageUrl: 'https://picsum.photos/seed/biz2/800/450',
      source: 'Bloomberg',
      url: 'https://bloomberg.com',
      categoryId: 'finance',
      publishedAt: _now.subtract(const Duration(hours: 5)),
      readTimeMinutes: 3,
    ),
    Article(
      id: 'biz-3',
      title: 'India Emerges as World\'s Fastest-Growing Major Economy',
      summary:
          'IMF data confirms India\'s GDP growth outpaced all G20 nations in the last fiscal year, driven by strong domestic consumption, infrastructure investment, and a booming technology services sector.',
      imageUrl: 'https://picsum.photos/seed/biz3/800/450',
      source: 'Economic Times',
      url: 'https://economictimes.com',
      categoryId: 'finance',
      publishedAt: _now.subtract(const Duration(hours: 9)),
      readTimeMinutes: 5,
    ),

    // Sports
    Article(
      id: 'sports-1',
      title: 'India Wins Cricket World Cup in Dramatic Final Over',
      summary:
          'A last-ball six from the lower order sealed an improbable victory for India in the ICC Men\'s Cricket World Cup final, sending millions of fans across the country into joyous celebration.',
      imageUrl: 'https://picsum.photos/seed/sports1/800/450',
      source: 'ESPN Cricinfo',
      url: 'https://espncricinfo.com',
      categoryId: 'trending',
      publishedAt: _now.subtract(const Duration(hours: 10)),
      isBreaking: false,
      readTimeMinutes: 4,
    ),
    Article(
      id: 'sports-2',
      title: 'Wimbledon 2025: Carlos Alcaraz Defends Title in Five-Set Thriller',
      summary:
          'The Spanish world number one saved two match points in the fourth set before securing a historic back-to-back Wimbledon title in what commentators are calling one of the greatest finals in tournament history.',
      imageUrl: 'https://picsum.photos/seed/sports2/800/450',
      source: 'Sky Sports',
      url: 'https://skysports.com',
      categoryId: 'trending',
      publishedAt: _now.subtract(const Duration(hours: 12)),
      readTimeMinutes: 4,
    ),
    Article(
      id: 'sports-3',
      title: 'Formula 1 Announces Sweeping Safety Regulation Changes for 2026',
      summary:
          'The FIA has unveiled new technical regulations including enhanced crash structures, improved fire suppression systems, and stricter cockpit protection standards following a comprehensive safety review.',
      imageUrl: 'https://picsum.photos/seed/sports3/800/450',
      source: 'Autosport',
      url: 'https://autosport.com',
      categoryId: 'trending',
      publishedAt: _now.subtract(const Duration(hours: 14)),
      readTimeMinutes: 3,
    ),

    // Entertainment
    Article(
      id: 'ent-1',
      title: 'Cannes Palme d\'Or Winner to Stream Exclusively on Netflix',
      summary:
          'The acclaimed French drama that took home this year\'s top prize at Cannes Film Festival will bypass theatrical release in most markets and head directly to Netflix, reigniting debate about streaming and cinema.',
      imageUrl: 'https://picsum.photos/seed/ent1/800/450',
      source: 'Variety',
      url: 'https://variety.com',
      categoryId: 'misc',
      publishedAt: _now.subtract(const Duration(hours: 3, minutes: 15)),
      readTimeMinutes: 3,
    ),
    Article(
      id: 'ent-2',
      title: 'Oscar Nominations: Indie Films Dominate as Studios Face Surprise Snubs',
      summary:
          'This year\'s Academy Award nominations featured an unusually high proportion of independent productions, with several major studio blockbusters shut out from key categories despite strong box office performance.',
      imageUrl: 'https://picsum.photos/seed/ent2/800/450',
      source: 'Hollywood Reporter',
      url: 'https://hollywoodreporter.com',
      categoryId: 'misc',
      publishedAt: _now.subtract(const Duration(hours: 6, minutes: 45)),
      readTimeMinutes: 5,
    ),
    Article(
      id: 'ent-3',
      title: 'Beyoncé\'s New Album Breaks Global Streaming Records in 24 Hours',
      summary:
          'The superstar\'s eighth studio album amassed over 400 million streams within its first day of release, smashing previous records and crashing multiple streaming platforms due to overwhelming demand.',
      imageUrl: 'https://picsum.photos/seed/ent3/800/450',
      source: 'Rolling Stone',
      url: 'https://rollingstone.com',
      categoryId: 'misc',
      publishedAt: _now.subtract(const Duration(hours: 11)),
      readTimeMinutes: 3,
    ),

    // Science
    Article(
      id: 'sci-1',
      title: 'NASA\'s Artemis Mission Successfully Establishes Lunar Gateway Station',
      summary:
          'Astronauts have completed assembly of the first module of the Lunar Gateway, a space station in lunar orbit that will serve as a staging point for crewed missions to the Moon\'s surface and, eventually, Mars.',
      imageUrl: 'https://picsum.photos/seed/sci1/800/450',
      source: 'NASA',
      url: 'https://nasa.gov',
      categoryId: 'economics',
      publishedAt: _now.subtract(const Duration(hours: 4, minutes: 20)),
      isBreaking: true,
      readTimeMinutes: 6,
    ),
    Article(
      id: 'sci-2',
      title: 'Scientists Achieve Breakthrough in Nuclear Fusion Net Energy Gain',
      summary:
          'Researchers at the National Ignition Facility have repeated their landmark fusion ignition result at three times the previous energy yield, bringing commercial fusion power significantly closer to reality.',
      imageUrl: 'https://picsum.photos/seed/sci2/800/450',
      source: 'Nature',
      url: 'https://nature.com',
      categoryId: 'economics',
      publishedAt: _now.subtract(const Duration(hours: 8, minutes: 10)),
      readTimeMinutes: 7,
    ),
    Article(
      id: 'sci-3',
      title: 'Deep-Sea Expedition Discovers 30 New Species in Pacific Ocean Trench',
      summary:
          'Marine biologists returning from a six-week expedition to the Mariana Trench have catalogued dozens of previously unknown organisms, including bioluminescent fish and extremophile bacteria with unique biochemical properties.',
      imageUrl: 'https://picsum.photos/seed/sci3/800/450',
      source: 'National Geographic',
      url: 'https://nationalgeographic.com',
      categoryId: 'economics',
      publishedAt: _now.subtract(const Duration(hours: 15)),
      readTimeMinutes: 5,
    ),

    // Sector Update — top-up to 6
    Article(
      id: 'tech-5',
      title: 'Quantum Computing Startup Raises \$500M to Build First Commercial Processor',
      summary:
          'A Silicon Valley startup has secured the largest-ever Series C funding round in quantum computing, aiming to deliver a fault-tolerant 1,000-qubit processor to enterprise customers within 18 months.',
      imageUrl: 'https://picsum.photos/seed/tech5/800/450',
      source: 'Wired',
      url: 'https://wired.com',
      categoryId: 'sector_update',
      publishedAt: _now.subtract(const Duration(hours: 10)),
      readTimeMinutes: 4,
    ),
    Article(
      id: 'tech-6',
      title: 'Semiconductor Giants Announce Joint Roadmap to 1nm Chips by 2027',
      summary:
          'TSMC, Samsung, and Intel have published a shared technical roadmap outlining the path to sub-1nm process nodes, a move that analysts say signals a new era of cooperation to sustain Moore\'s Law.',
      imageUrl: 'https://picsum.photos/seed/tech6/800/450',
      source: 'IEEE Spectrum',
      url: 'https://spectrum.ieee.org',
      categoryId: 'sector_update',
      publishedAt: _now.subtract(const Duration(hours: 13)),
      readTimeMinutes: 5,
    ),

    // Regional Update — top-up to 6
    Article(
      id: 'world-4',
      title: 'Southeast Asia Forms New Trade Bloc to Counter Supply Chain Shifts',
      summary:
          'Seven nations have signed the Mekong Economic Cooperation Agreement, creating a unified customs zone and shared infrastructure fund aimed at attracting manufacturers relocating out of higher-cost markets.',
      imageUrl: 'https://picsum.photos/seed/world4/800/450',
      source: 'Nikkei Asia',
      url: 'https://asia.nikkei.com',
      categoryId: 'regional_update',
      publishedAt: _now.subtract(const Duration(hours: 5, minutes: 30)),
      readTimeMinutes: 4,
    ),
    Article(
      id: 'world-5',
      title: 'African Union Launches Pan-Continental High-Speed Rail Initiative',
      summary:
          'The AU Commission has unveiled a 25-year infrastructure masterplan to connect all 55 member states by rail, with the first 4,000-kilometre East Africa corridor breaking ground later this year.',
      imageUrl: 'https://picsum.photos/seed/world5/800/450',
      source: 'African Business',
      url: 'https://african.business',
      categoryId: 'regional_update',
      publishedAt: _now.subtract(const Duration(hours: 9)),
      readTimeMinutes: 5,
    ),
    Article(
      id: 'world-6',
      title: 'Arctic Council Nations Agree on Emergency Climate Response Protocol',
      summary:
          'The eight Arctic Council member states have unanimously adopted binding emissions targets and a joint early-warning system for permafrost thaw, citing accelerating ice loss as an existential regional threat.',
      imageUrl: 'https://picsum.photos/seed/world6/800/450',
      source: 'The Guardian',
      url: 'https://theguardian.com',
      categoryId: 'regional_update',
      publishedAt: _now.subtract(const Duration(hours: 16)),
      readTimeMinutes: 4,
    ),

    // Finance — top-up to 6
    Article(
      id: 'biz-4',
      title: 'Crypto Markets Surge as Spot Bitcoin ETF Sees Record Inflows',
      summary:
          'US-listed spot Bitcoin exchange-traded funds recorded over \$2 billion in net inflows in a single week, pushing the asset class to a new all-time high and dragging broader crypto markets sharply upward.',
      imageUrl: 'https://picsum.photos/seed/biz4/800/450',
      source: 'CoinDesk',
      url: 'https://coindesk.com',
      categoryId: 'finance',
      publishedAt: _now.subtract(const Duration(hours: 3, minutes: 40)),
      readTimeMinutes: 3,
    ),
    Article(
      id: 'biz-5',
      title: 'European Central Bank Cuts Rates for Third Consecutive Meeting',
      summary:
          'The ECB reduced its benchmark deposit rate by 25 basis points, citing receding inflationary pressure and a need to support slowing growth across the eurozone\'s largest economies.',
      imageUrl: 'https://picsum.photos/seed/biz5/800/450',
      source: 'Reuters',
      url: 'https://reuters.com',
      categoryId: 'finance',
      publishedAt: _now.subtract(const Duration(hours: 7)),
      readTimeMinutes: 4,
    ),
    Article(
      id: 'biz-6',
      title: 'Private Credit Surpasses \$2 Trillion as Banks Retreat from Leveraged Lending',
      summary:
          'Non-bank lenders now account for the majority of leveraged buyout financing in the US and Europe, as tighter bank capital rules under Basel III push institutional borrowers toward alternative credit markets.',
      imageUrl: 'https://picsum.photos/seed/biz6/800/450',
      source: 'Financial Times',
      url: 'https://ft.com',
      categoryId: 'finance',
      publishedAt: _now.subtract(const Duration(hours: 18)),
      readTimeMinutes: 6,
    ),

    // Trending — top-up to 6
    Article(
      id: 'sports-4',
      title: 'Paris Marathon Sets New Course Record as Kenyan Duo Dominates',
      summary:
          'In ideal running conditions, two Kenyan athletes shattered the Paris course record by over two minutes, with the winner clocking 2:00:14 in a performance already being called one of the greatest marathon runs in history.',
      imageUrl: 'https://picsum.photos/seed/sports4/800/450',
      source: 'World Athletics',
      url: 'https://worldathletics.org',
      categoryId: 'trending',
      publishedAt: _now.subtract(const Duration(hours: 6)),
      readTimeMinutes: 3,
    ),
    Article(
      id: 'sports-5',
      title: 'NBA Finals: Golden State Warriors Force Decisive Game 7',
      summary:
          'A 41-point performance from their veteran point guard kept the Warriors\' title hopes alive, forcing a winner-takes-all seventh game against the Boston Celtics in what commentators are calling the best Finals series in a decade.',
      imageUrl: 'https://picsum.photos/seed/sports5/800/450',
      source: 'ESPN',
      url: 'https://espn.com',
      categoryId: 'trending',
      publishedAt: _now.subtract(const Duration(hours: 8)),
      readTimeMinutes: 4,
    ),
    Article(
      id: 'sports-6',
      title: 'IOC Confirms 2036 Summer Olympics Will Be Hosted by India',
      summary:
          'The International Olympic Committee has formally awarded the 2036 Summer Games to Ahmedabad, making India the first South Asian nation to host the modern Olympics after a decade-long bid.',
      imageUrl: 'https://picsum.photos/seed/sports6/800/450',
      source: 'BBC Sport',
      url: 'https://bbc.com/sport',
      categoryId: 'trending',
      publishedAt: _now.subtract(const Duration(hours: 20)),
      readTimeMinutes: 4,
    ),

    // Misc — top-up to 6
    Article(
      id: 'ent-4',
      title: 'Streaming Wars Cool as Disney+ and Netflix Report Subscriber Slowdowns',
      summary:
          'Both streaming giants missed quarterly subscriber growth forecasts, prompting analysts to question whether the era of rapid streaming expansion has ended and signalling a likely pivot to profitability over growth.',
      imageUrl: 'https://picsum.photos/seed/ent4/800/450',
      source: 'Deadline',
      url: 'https://deadline.com',
      categoryId: 'misc',
      publishedAt: _now.subtract(const Duration(hours: 4, minutes: 50)),
      readTimeMinutes: 4,
    ),
    Article(
      id: 'ent-5',
      title: 'Video Game Industry Sees Record \$200B Revenue Year Driven by Mobile',
      summary:
          'Global video game revenues surpassed \$200 billion for the first time, with mobile gaming accounting for more than half of all sales and emerging markets in South Asia and Africa leading growth.',
      imageUrl: 'https://picsum.photos/seed/ent5/800/450',
      source: 'Games Industry',
      url: 'https://gamesindustry.biz',
      categoryId: 'misc',
      publishedAt: _now.subtract(const Duration(hours: 13)),
      readTimeMinutes: 3,
    ),
    Article(
      id: 'ent-6',
      title: 'Broadway Season Opens with Record Advance Ticket Sales',
      summary:
          'The new Broadway season has generated the highest advance ticket revenue in history, with three major revivals and two original musicals already sold out through their entire runs months before opening night.',
      imageUrl: 'https://picsum.photos/seed/ent6/800/450',
      source: 'Playbill',
      url: 'https://playbill.com',
      categoryId: 'misc',
      publishedAt: _now.subtract(const Duration(hours: 22)),
      readTimeMinutes: 3,
    ),

    // Economics — top-up to 6
    Article(
      id: 'sci-4',
      title: 'WHO Approves First Malaria Vaccine for Adults After Phase 3 Trials',
      summary:
          'The World Health Organisation has granted full approval to R21/Matrix-M for adult use following trials across six sub-Saharan African countries, marking a major milestone in the decades-long effort to eliminate the disease.',
      imageUrl: 'https://picsum.photos/seed/sci4/800/450',
      source: 'The Lancet',
      url: 'https://thelancet.com',
      categoryId: 'economics',
      publishedAt: _now.subtract(const Duration(hours: 6, minutes: 10)),
      readTimeMinutes: 5,
    ),
    Article(
      id: 'sci-5',
      title: 'Astronomers Detect First Confirmed Water Vapour on Habitable-Zone Exoplanet',
      summary:
          'James Webb Space Telescope data has confirmed the presence of water vapour in the atmosphere of a super-Earth located 40 light-years away in the habitable zone of its star, reviving debate about potential extraterrestrial life.',
      imageUrl: 'https://picsum.photos/seed/sci5/800/450',
      source: 'ESA',
      url: 'https://esa.int',
      categoryId: 'economics',
      publishedAt: _now.subtract(const Duration(hours: 11, minutes: 30)),
      readTimeMinutes: 6,
    ),
    Article(
      id: 'sci-6',
      title: 'CRISPR Gene Editing Used to Reverse Inherited Blindness in Clinical Trial',
      summary:
          'Twelve patients with a rare inherited retinal dystrophy have shown measurable improvements in vision six months after receiving a single in-eye CRISPR treatment, the first in-body gene-editing therapy to reach phase 2 trials.',
      imageUrl: 'https://picsum.photos/seed/sci6/800/450',
      source: 'New England Journal of Medicine',
      url: 'https://nejm.org',
      categoryId: 'economics',
      publishedAt: _now.subtract(const Duration(hours: 19)),
      readTimeMinutes: 7,
    ),

    // RSS — 6 articles for feed-sourced content
    Article(
      id: 'rss-1',
      title: 'Morning Briefing: Top 5 Stories You Need to Know Today',
      summary:
          'A curated digest of the most important developments across business, technology, world affairs, and culture — compiled from over 500 trusted RSS sources and updated every hour.',
      imageUrl: 'https://picsum.photos/seed/rss1/800/450',
      source: 'NewScout Digest',
      url: 'https://newscout.in',
      categoryId: 'rss',
      publishedAt: _now.subtract(const Duration(hours: 1)),
      readTimeMinutes: 2,
    ),
    Article(
      id: 'rss-2',
      title: 'Weekly Roundup: Science and Innovation Highlights',
      summary:
          'From quantum breakthroughs to green energy milestones, this week\'s most-shared science and innovation stories aggregated from leading journals, research institutions, and tech publications.',
      imageUrl: 'https://picsum.photos/seed/rss2/800/450',
      source: 'NewScout Weekly',
      url: 'https://newscout.in',
      categoryId: 'rss',
      publishedAt: _now.subtract(const Duration(hours: 5)),
      readTimeMinutes: 4,
    ),
    Article(
      id: 'rss-3',
      title: 'Markets Wrap: Indices, Commodities, and Currencies at a Glance',
      summary:
          'End-of-day summary of global financial markets aggregated from Bloomberg, Reuters, and regional financial feeds — covering equities, bonds, oil, gold, and major currency pairs.',
      imageUrl: 'https://picsum.photos/seed/rss3/800/450',
      source: 'NewScout Markets',
      url: 'https://newscout.in',
      categoryId: 'rss',
      publishedAt: _now.subtract(const Duration(hours: 9)),
      readTimeMinutes: 3,
    ),
    Article(
      id: 'rss-4',
      title: 'Policy Watch: Regulatory Updates Affecting Tech and Finance',
      summary:
          'A weekly aggregation of regulatory filings, government announcements, and policy changes from the EU, US, and Asia-Pacific regions that have material implications for the technology and financial services sectors.',
      imageUrl: 'https://picsum.photos/seed/rss4/800/450',
      source: 'NewScout Policy',
      url: 'https://newscout.in',
      categoryId: 'rss',
      publishedAt: _now.subtract(const Duration(hours: 14)),
      readTimeMinutes: 5,
    ),
    Article(
      id: 'rss-5',
      title: 'Startup Radar: Funding Rounds and Product Launches This Week',
      summary:
          'A curated list of notable venture capital rounds, product launches, and acqui-hires tracked across TechCrunch, Crunchbase, and 40+ startup-focused RSS feeds from the past seven days.',
      imageUrl: 'https://picsum.photos/seed/rss5/800/450',
      source: 'NewScout Startups',
      url: 'https://newscout.in',
      categoryId: 'rss',
      publishedAt: _now.subtract(const Duration(hours: 17)),
      readTimeMinutes: 4,
    ),
    Article(
      id: 'rss-6',
      title: 'Opinion Digest: Best Long-Form Reads From Across the Web',
      summary:
          'Hand-picked essays, investigations, and long-form journalism from across the open web — aggregated from Substack newsletters, independent publications, and premium RSS feeds subscribed by our editorial team.',
      imageUrl: 'https://picsum.photos/seed/rss6/800/450',
      source: 'NewScout Reads',
      url: 'https://newscout.in',
      categoryId: 'rss',
      publishedAt: _now.subtract(const Duration(hours: 23)),
      readTimeMinutes: 6,
    ),
  ];

  // ── NewsService implementation ────────────────────────────────────────────

  @override
  Future<List<NewsCategory>> getCategories() async {
    await _fakeDelay();
    return List.unmodifiable(_categories);
  }

  @override
  Future<List<Article>> getArticles({
    String? categoryId,
    int limit = 20,
    int offset = 0,
  }) async {
    await _fakeDelay();
    var filtered = categoryId == null
        ? _articles
        : _articles.where((a) => a.categoryId == categoryId).toList();
    filtered = filtered.skip(offset).take(limit).toList();
    return filtered;
  }

  @override
  Future<List<Article>> getBreakingNews() async {
    await _fakeDelay(ms: 300);
    return _articles.where((a) => a.isBreaking).toList();
  }

  @override
  Future<List<Article>> searchArticles(String query) async {
    await _fakeDelay(ms: 400);
    if (query.trim().isEmpty) return [];
    final q = query.toLowerCase();
    return _articles
        .where((a) =>
            a.title.toLowerCase().contains(q) ||
            a.summary.toLowerCase().contains(q) ||
            a.source.toLowerCase().contains(q))
        .toList();
  }

  @override
  Future<Article> getArticle(String id) async {
    await _fakeDelay(ms: 300);
    return _articles.firstWhere(
      (a) => a.id == id,
      orElse: () => throw Exception('Article not found'),
    );
  }

  Future<void> _fakeDelay({int ms = 600}) =>
      Future.delayed(Duration(milliseconds: ms));
}
