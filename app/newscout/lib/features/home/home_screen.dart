import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../config/app_config.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/providers/news_provider.dart';
import '../../shared/widgets/shimmer_loading.dart';
import 'widgets/article_card.dart';
import 'widgets/breaking_news_carousel.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadData());
  }

  Future<void> _loadData() async {
    final news = context.read<NewsProvider>();
    await Future.wait([
      news.loadHome(),
      news.loadBreakingNews(),
      if (news.categories.isEmpty) news.loadCategories(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    final news = context.watch<NewsProvider>();
    final auth = context.watch<AuthProvider>();
    final theme = Theme.of(context);

    return Scaffold(
      body: RefreshIndicator(
        color: AppConfig.primaryColor,
        onRefresh: _loadData,
        child: CustomScrollView(
          slivers: [
            // ── App Bar ───────────────────────────────────────────────────
            SliverAppBar(
              floating: true,
              snap: true,
              elevation: 0,
              scrolledUnderElevation: 1,
              title: Text(
                'Home',
                style: TextStyle(
                  color: AppConfig.primaryColor,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                ),
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.search,
                      color: AppConfig.primaryColor),
                  onPressed: () => context.go('/search'),
                ),
                const SizedBox(width: 4),
              ],
            ),

            // ── Breaking News Section ─────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.only(top: 16, bottom: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: [
                          Container(
                            width: 3,
                            height: 18,
                            decoration: BoxDecoration(
                              color: AppConfig.accentColor,
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Breaking News',
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    BreakingNewsCarousel(
                      articles: news.breakingNews,
                      isLoading: news.isLoadingBreaking,
                    ),
                  ],
                ),
              ),
            ),

            // ── Top Stories Header ────────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  children: [
                    Container(
                      width: 3,
                      height: 18,
                      decoration: BoxDecoration(
                        color: AppConfig.primaryColor,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Top Stories',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Article List / Shimmer ────────────────────────────────────
            if (news.isLoadingHome)
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (_, _) => const ArticleCardShimmer(),
                  childCount: 5,
                ),
              )
            else if (news.error != null)
              SliverFillRemaining(
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.wifi_off_rounded,
                          size: 48, color: theme.colorScheme.onSurfaceVariant),
                      const SizedBox(height: 12),
                      Text('Could not load news',
                          style: TextStyle(color: theme.colorScheme.onSurfaceVariant)),
                      if (news.error != null) ...[
                        const SizedBox(height: 8),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 24),
                          child: Text(
                            news.error!,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: theme.colorScheme.onSurfaceVariant.withAlpha(180),
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                      const SizedBox(height: 16),
                      FilledButton(
                          onPressed: _loadData, child: const Text('Retry')),
                    ],
                  ),
                ),
              )
            else
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final article = news.homeArticles[index];
                    final category = news.categoryById(article.categoryId);
                    return ArticleCard(article: article, category: category);
                  },
                  childCount: news.homeArticles.length,
                ),
              ),

            // ── Personalisation promo (anonymous users) ───────────────────
            if (!auth.isLoggedIn && !news.isLoadingHome)
              SliverToBoxAdapter(
                child: _PersonalisationPromo(
                  onLoginTap: () => context.go('/profile/login'),
                ),
              ),

            // ── For You section (logged in users) ────────────────────────
            if (auth.isLoggedIn && !news.isLoadingHome)
              SliverToBoxAdapter(
                child: _ForYouSection(
                  userName: auth.currentUser!.name.split(' ').first,
                ),
              ),

            const SliverToBoxAdapter(child: SizedBox(height: 24)),
          ],
        ),
      ),
    );
  }
}

class _PersonalisationPromo extends StatelessWidget {
  final VoidCallback onLoginTap;

  const _PersonalisationPromo({required this.onLoginTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppConfig.primaryColor, Color(0xFF1A5757)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Get Personalised News',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Sign in to follow topics you care about.',
                  style: TextStyle(
                    color: Colors.white.withAlpha(200),
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 14),
                ElevatedButton(
                  onPressed: onLoginTap,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppConfig.accentColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 10),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text('Sign In',
                      style: TextStyle(fontWeight: FontWeight.w700)),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          const Icon(Icons.newspaper_rounded, color: Colors.white38, size: 56),
        ],
      ),
    );
  }
}

class _ForYouSection extends StatelessWidget {
  final String userName;

  const _ForYouSection({required this.userName});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppConfig.primaryColor.withAlpha(15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppConfig.primaryColor.withAlpha(40)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: AppConfig.primaryColor,
            child: Text(
              userName[0].toUpperCase(),
              style: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.w700),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'Welcome back, $userName! Your personalised feed is ready.',
              style: const TextStyle(fontSize: 13, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }
}
