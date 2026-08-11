import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:timeago/timeago.dart' as timeago;

import '../../config/app_config.dart';
import '../../config/app_theme.dart';
import '../../core/models/article.dart';
import '../../core/providers/bookmarks_provider.dart';
import '../../core/providers/trending_provider.dart';
import '../../shared/widgets/shimmer_loading.dart' show ArticleCardShimmer;

enum TrendingPeriod { now, today, week }

extension _PeriodHours on TrendingPeriod {
  int get hours {
    switch (this) {
      case TrendingPeriod.now:
        return 6;
      case TrendingPeriod.today:
        return 24;
      case TrendingPeriod.week:
        return 168; // 7 days
    }
  }
}

class TrendingScreen extends StatefulWidget {
  const TrendingScreen({super.key});

  @override
  State<TrendingScreen> createState() => _TrendingScreenState();
}

class _TrendingScreenState extends State<TrendingScreen> {
  TrendingPeriod _period = TrendingPeriod.now;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TrendingProvider>().load();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<TrendingProvider>();

    final items = provider.articlesForPeriod(hours: _period.hours);
    final hero = items.isNotEmpty ? items.first : null;
    final rest = items.length > 1 ? items.sublist(1) : <Article>[];

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: _TrendingHeader()),
          SliverToBoxAdapter(
            child: _PeriodChips(
              selected: _period,
              onChanged: (period) => setState(() => _period = period),
            ),
          ),
          if (provider.isLoading)
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (_, _) => const ArticleCardShimmer(),
                childCount: 4,
              ),
            )
          else if (provider.error != null)
            SliverToBoxAdapter(
              child: _ErrorBanner(
                message: provider.error!,
                onRetry: () => provider.load(refresh: true),
              ),
            )
          else if (items.isEmpty)
            const SliverToBoxAdapter(
              child: _EmptyState(),
            )
          else ...[
            if (hero != null)
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: _HeroCard(article: hero, rank: 1),
                ),
              ),
            if (rest.isNotEmpty)
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: Text(
                    'Trending stories',
                    style: AppTheme.headline(18, FontWeight.w700),
                  ),
                ),
              ),
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => _RankedTile(
                  article: rest[index],
                  rank: index + 2,
                ),
                childCount: rest.length,
              ),
            ),
          ],
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }
}

class _TrendingHeader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final top = MediaQuery.paddingOf(context).top;

    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(20, top + 16, 20, 20),
      decoration: const BoxDecoration(
        color: AppConfig.primaryColor,
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppConfig.accentColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.local_fire_department_rounded,
              color: Colors.white,
              size: 28,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Trending Now',
                  style: AppTheme.headline(
                    24,
                    FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'The most read stories across ${AppConfig.appName}',
                  style: AppTheme.body(
                    13,
                    FontWeight.w400,
                    color: Colors.white.withAlpha(200),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _PeriodChips extends StatelessWidget {
  final TrendingPeriod selected;
  final ValueChanged<TrendingPeriod> onChanged;

  const _PeriodChips({required this.selected, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    const labels = {
      TrendingPeriod.now: 'Now',
      TrendingPeriod.today: 'Today',
      TrendingPeriod.week: 'This week',
    };

    return Container(
      color: theme.colorScheme.surface,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: TrendingPeriod.values.map((period) {
          final isSelected = period == selected;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: Text(labels[period]!),
              selected: isSelected,
              onSelected: (_) => onChanged(period),
              selectedColor: AppConfig.accentColor.withAlpha(40),
              labelStyle: TextStyle(
                color: isSelected
                    ? AppConfig.accentColor
                    : theme.colorScheme.onSurfaceVariant,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                fontSize: 13,
              ),
              side: BorderSide(
                color: isSelected
                    ? AppConfig.accentColor
                    : theme.dividerColor,
              ),
              backgroundColor: theme.colorScheme.surface,
              showCheckmark: false,
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _HeroCard extends StatelessWidget {
  final Article article;
  final int rank;

  const _HeroCard({required this.article, required this.rank});

  @override
  Widget build(BuildContext context) {
    final bookmarks = context.watch<BookmarksProvider>();
    final isBookmarked = bookmarks.isBookmarked(article.id);
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: () => context.push('/article/${article.id}', extra: article),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.local_fire_department_rounded,
                color: AppConfig.accentColor,
                size: 20,
              ),
              const SizedBox(width: 6),
              Text(
                '#$rank Trending',
                style: AppTheme.body(
                  13,
                  FontWeight.w700,
                  color: AppConfig.accentColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Container(
            decoration: BoxDecoration(
              color: theme.cardTheme.color ?? theme.colorScheme.surface,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withAlpha(13),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Stack(
                  children: [
                    CachedNetworkImage(
                      imageUrl: article.imageUrl,
                      height: 200,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      placeholder: (_, _) => Container(
                        height: 200,
                        color: theme.colorScheme.surfaceContainerHighest,
                      ),
                      errorWidget: (_, _, _) => Container(
                        height: 200,
                        color: theme.colorScheme.surfaceContainerHighest,
                        child: Icon(Icons.image_not_supported_outlined,
                            color: theme.colorScheme.onSurfaceVariant, size: 40),
                      ),
                    ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: GestureDetector(
                        onTap: () => bookmarks.toggleBookmark(article),
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.surface.withAlpha(230),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            isBookmarked
                                ? Icons.bookmark
                                : Icons.bookmark_outline,
                            size: 18,
                            color: isBookmarked
                                ? AppConfig.primaryColor
                                : theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        article.title,
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                        style:
                            AppTheme.headline(18, FontWeight.w700, height: 1.3),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        article.summary,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: AppTheme.body(
                          13,
                          FontWeight.w400,
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                      const SizedBox(height: 12),
                      _MetaRibbon(article: article),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MetaRibbon extends StatelessWidget {
  final Article article;

  const _MetaRibbon({required this.article});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Wrap(
        spacing: 14,
        runSpacing: 6,
        children: [
          _Stat(
            icon: Icons.access_time,
            label: '${article.readTimeMinutes} min read',
          ),
          _Stat(
            icon: Icons.schedule,
            label: timeago.format(article.publishedAt),
          ),
          if (article.source.isNotEmpty)
            _Stat(
              icon: Icons.article_outlined,
              label: article.source,
            ),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  final IconData icon;
  final String label;

  const _Stat({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: theme.colorScheme.onSurfaceVariant),
        const SizedBox(width: 4),
        Text(
          label,
          style: AppTheme.body(
            12,
            FontWeight.w500,
            color: theme.colorScheme.onSurfaceVariant,
          ),
        ),
      ],
    );
  }
}

class _RankedTile extends StatelessWidget {
  final Article article;
  final int rank;

  const _RankedTile({required this.article, required this.rank});

  @override
  Widget build(BuildContext context) {
    final bookmarks = context.watch<BookmarksProvider>();
    final isBookmarked = bookmarks.isBookmarked(article.id);
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: () => context.push('/article/${article.id}', extra: article),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: theme.cardTheme.color ?? theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(10),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 36,
              child: Text(
                '#$rank',
                style: AppTheme.headline(
                  18,
                  FontWeight.w800,
                  color: AppConfig.accentColor,
                ),
              ),
            ),
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: CachedNetworkImage(
                imageUrl: article.imageUrl,
                width: 72,
                height: 72,
                fit: BoxFit.cover,
                placeholder: (_, _) => Container(
                  width: 72,
                  height: 72,
                  color: theme.colorScheme.surfaceContainerHighest,
                ),
                errorWidget: (_, _, _) => Container(
                  width: 72,
                  height: 72,
                  color: theme.colorScheme.surfaceContainerHighest,
                  child: Icon(Icons.image_not_supported_outlined,
                      color: theme.colorScheme.onSurfaceVariant),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    article.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppTheme.headline(14, FontWeight.w600, height: 1.3),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          '${timeago.format(article.publishedAt)} · ${article.source}',
                          style: AppTheme.body(
                            12,
                            FontWeight.w400,
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      GestureDetector(
                        onTap: () => bookmarks.toggleBookmark(article),
                        child: Icon(
                          isBookmarked
                              ? Icons.bookmark
                              : Icons.bookmark_outline,
                          size: 18,
                          color: isBookmarked
                              ? AppConfig.primaryColor
                              : theme.colorScheme.onSurfaceVariant.withAlpha(150),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const _ErrorBanner({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Icon(Icons.wifi_off_outlined,
              size: 48, color: theme.colorScheme.onSurfaceVariant),
          const SizedBox(height: 12),
          Text(
            'Could not load trending articles',
            style: AppTheme.body(
              14,
              FontWeight.w500,
              color: theme.colorScheme.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          TextButton(onPressed: onRetry, child: const Text('Try again')),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        children: [
          Icon(Icons.local_fire_department_outlined,
              size: 48, color: theme.colorScheme.onSurfaceVariant),
          const SizedBox(height: 12),
          Text(
            'No trending stories for this period',
            style: AppTheme.body(
              14,
              FontWeight.w500,
              color: theme.colorScheme.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
