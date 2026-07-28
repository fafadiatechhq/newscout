import '../../core/models/article.dart';

enum TrendingPeriod { now, today, week }

class TrendingItem {
  final Article article;
  final int rank;
  final int views;
  final TrendingPeriod period;

  const TrendingItem({
    required this.article,
    required this.rank,
    required this.views,
    required this.period,
  });
}

/// Local mock trending feed. Swap for API later (`?trending=true`).
class TrendingMock {
  static final _now = DateTime.now();

  static final List<TrendingItem> _items = [
    TrendingItem(
      article: Article(
        id: 'trend-1',
        title: 'AI Models Achieve Human-Level Performance on Complex Reasoning Tasks',
        summary:
            'New benchmark results show that the latest generation of large language models can now solve multi-step reasoning problems at a level comparable to expert humans.',
        imageUrl: 'https://picsum.photos/seed/trend1/800/450',
        source: 'TechCrunch',
        url: 'https://techcrunch.com',
        categoryId: 'sector_update',
        publishedAt: _now.subtract(const Duration(hours: 1)),
        isBreaking: true,
        readTimeMinutes: 5,
      ),
      rank: 1,
      views: 15420,
      period: TrendingPeriod.now,
    ),
    TrendingItem(
      article: Article(
        id: 'trend-2',
        title: 'Historic Climate Summit Reaches Agreement on Carbon Neutrality by 2040',
        summary:
            'Over 150 nations signed the landmark accord, pledging to achieve net-zero carbon emissions a decade ahead of previous targets.',
        imageUrl: 'https://picsum.photos/seed/trend2/800/450',
        source: 'Reuters',
        url: 'https://reuters.com',
        categoryId: 'regional_update',
        publishedAt: _now.subtract(const Duration(hours: 2)),
        isBreaking: true,
        readTimeMinutes: 5,
      ),
      rank: 2,
      views: 14300,
      period: TrendingPeriod.now,
    ),
    TrendingItem(
      article: Article(
        id: 'trend-3',
        title: 'Federal Reserve Signals Rate Cuts in Second Half of 2025',
        summary:
            'Fed Chair Jerome Powell indicated the central bank is prepared to ease monetary policy if inflation continues its downward trend.',
        imageUrl: 'https://picsum.photos/seed/trend3/800/450',
        source: 'Financial Times',
        url: 'https://ft.com',
        categoryId: 'finance',
        publishedAt: _now.subtract(const Duration(hours: 3)),
        readTimeMinutes: 4,
      ),
      rank: 3,
      views: 12300,
      period: TrendingPeriod.now,
    ),
    TrendingItem(
      article: Article(
        id: 'trend-4',
        title: 'India Wins Cricket World Cup in Dramatic Final Over',
        summary:
            'A last-ball six from the lower order sealed an improbable victory for India in the ICC Men\'s Cricket World Cup final.',
        imageUrl: 'https://picsum.photos/seed/trend4/800/450',
        source: 'ESPN Cricinfo',
        url: 'https://espncricinfo.com',
        categoryId: 'trending',
        publishedAt: _now.subtract(const Duration(hours: 5)),
        readTimeMinutes: 4,
      ),
      rank: 4,
      views: 11200,
      period: TrendingPeriod.today,
    ),
    TrendingItem(
      article: Article(
        id: 'trend-5',
        title: 'Apple Vision Pro 2 Rumoured to Feature All-Day Battery Life',
        summary:
            'Sources close to Apple supply chain report that the next generation headset will include a significantly improved battery system.',
        imageUrl: 'https://picsum.photos/seed/trend5/800/450',
        source: 'The Verge',
        url: 'https://theverge.com',
        categoryId: 'sector_update',
        publishedAt: _now.subtract(const Duration(hours: 8)),
        readTimeMinutes: 4,
      ),
      rank: 5,
      views: 9870,
      period: TrendingPeriod.today,
    ),
    TrendingItem(
      article: Article(
        id: 'trend-6',
        title: 'India Emerges as World\'s Fastest-Growing Major Economy',
        summary:
            'IMF data confirms India\'s GDP growth outpaced all G20 nations in the last fiscal year, driven by strong domestic consumption.',
        imageUrl: 'https://picsum.photos/seed/trend6/800/450',
        source: 'Economic Times',
        url: 'https://economictimes.com',
        categoryId: 'finance',
        publishedAt: _now.subtract(const Duration(hours: 12)),
        readTimeMinutes: 5,
      ),
      rank: 6,
      views: 8900,
      period: TrendingPeriod.today,
    ),
    TrendingItem(
      article: Article(
        id: 'trend-7',
        title: 'Open Source LLM Surpasses GPT-4 in Code Generation Benchmarks',
        summary:
            'A new open-weight model trained on curated programming datasets has outperformed commercial offerings on standard code tasks.',
        imageUrl: 'https://picsum.photos/seed/trend7/800/450',
        source: 'Hacker News',
        url: 'https://news.ycombinator.com',
        categoryId: 'sector_update',
        publishedAt: _now.subtract(const Duration(days: 2)),
        readTimeMinutes: 3,
      ),
      rank: 7,
      views: 8540,
      period: TrendingPeriod.week,
    ),
    TrendingItem(
      article: Article(
        id: 'trend-8',
        title: 'Wimbledon 2025: Carlos Alcaraz Defends Title in Five-Set Thriller',
        summary:
            'The Spanish world number one saved two match points before securing a historic back-to-back Wimbledon title.',
        imageUrl: 'https://picsum.photos/seed/trend8/800/450',
        source: 'Sky Sports',
        url: 'https://skysports.com',
        categoryId: 'trending',
        publishedAt: _now.subtract(const Duration(days: 3)),
        readTimeMinutes: 4,
      ),
      rank: 8,
      views: 7800,
      period: TrendingPeriod.week,
    ),
    TrendingItem(
      article: Article(
        id: 'trend-9',
        title: 'Amazon Expands Prime Benefits with New Healthcare Features',
        summary:
            'The e-commerce giant is rolling out telehealth consultations and prescription discounts to Prime members nationwide.',
        imageUrl: 'https://picsum.photos/seed/trend9/800/450',
        source: 'Bloomberg',
        url: 'https://bloomberg.com',
        categoryId: 'finance',
        publishedAt: _now.subtract(const Duration(days: 4)),
        readTimeMinutes: 3,
      ),
      rank: 9,
      views: 7230,
      period: TrendingPeriod.week,
    ),
    TrendingItem(
      article: Article(
        id: 'trend-10',
        title: 'Peace Talks Resume as International Mediators Step In',
        summary:
            'After months of stalled negotiations, international mediators have brokered a new framework for dialogue.',
        imageUrl: 'https://picsum.photos/seed/trend10/800/450',
        source: 'Al Jazeera',
        url: 'https://aljazeera.com',
        categoryId: 'regional_update',
        publishedAt: _now.subtract(const Duration(days: 5)),
        readTimeMinutes: 5,
      ),
      rank: 10,
      views: 6100,
      period: TrendingPeriod.week,
    ),
  ];

  /// Returns items for [period], re-ranked by views within the window.
  /// `now` ⊂ `today` ⊂ `week`.
  static List<TrendingItem> forPeriod(TrendingPeriod period) {
    final filtered = _items.where((item) {
      switch (period) {
        case TrendingPeriod.now:
          return item.period == TrendingPeriod.now;
        case TrendingPeriod.today:
          return item.period == TrendingPeriod.now ||
              item.period == TrendingPeriod.today;
        case TrendingPeriod.week:
          return true;
      }
    }).toList()
      ..sort((a, b) => b.views.compareTo(a.views));

    return [
      for (var i = 0; i < filtered.length; i++)
        TrendingItem(
          article: filtered[i].article,
          rank: i + 1,
          views: filtered[i].views,
          period: filtered[i].period,
        ),
    ];
  }

  static String formatViews(int views) {
    if (views >= 1000) {
      return '${(views / 1000).toStringAsFixed(1)}K';
    }
    return views.toString();
  }
}
