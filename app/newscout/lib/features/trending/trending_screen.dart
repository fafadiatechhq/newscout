import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:timeago/timeago.dart' as timeago;

import '../../config/app_config.dart';
import '../../config/app_theme.dart';
import '../../core/models/article.dart';
import '../../core/providers/bookmarks_provider.dart';
import 'trending_mock.dart';

class TrendingScreen extends StatefulWidget {
  const TrendingScreen({super.key});

  @override
  State<TrendingScreen> createState() => _TrendingScreenState();
}

class _TrendingScreenState extends State<TrendingScreen> {
  TrendingPeriod _period = TrendingPeriod.now;

  @override
  Widget build(BuildContext context) {
    final items = TrendingMock.forPeriod(_period);
    final hero = items.isNotEmpty ? items.first : null;
    final rest = items.length > 1 ? items.sublist(1) : <TrendingItem>[];

    return Scaffold(
      backgroundColor: AppConfig.surfaceColor,
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: _TrendingHeader()),
          SliverToBoxAdapter(
            child: _PeriodChips(
              selected: _period,
              onChanged: (period) => setState(() => _period = period),
            ),
          ),
          if (hero != null)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: _HeroCard(item: hero),
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
              (context, index) => _RankedTile(item: rest[index]),
              childCount: rest.length,
            ),
          ),
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
    const labels = {
      TrendingPeriod.now: 'Now',
      TrendingPeriod.today: 'Today',
      TrendingPeriod.week: 'This week',
    };

    return Container(
      color: Colors.white,
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
                    : Colors.grey.shade700,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                fontSize: 13,
              ),
              side: BorderSide(
                color: isSelected
                    ? AppConfig.accentColor
                    : Colors.grey.shade300,
              ),
              backgroundColor: Colors.white,
              showCheckmark: false,
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _HeroCard extends StatelessWidget {
  final TrendingItem item;

  const _HeroCard({required this.item});

  @override
  Widget build(BuildContext context) {
    final article = item.article;
    final bookmarks = context.watch<BookmarksProvider>();
    final isBookmarked = bookmarks.isBookmarked(article.id);

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
                '#1 Trending',
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
              color: Colors.white,
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
                        color: Colors.grey.shade100,
                      ),
                      errorWidget: (_, _, _) => Container(
                        height: 200,
                        color: Colors.grey.shade100,
                        child: const Icon(Icons.image_not_supported_outlined,
                            color: Colors.grey, size: 40),
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
                            color: Colors.white.withAlpha(230),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            isBookmarked
                                ? Icons.bookmark
                                : Icons.bookmark_outline,
                            size: 18,
                            color: isBookmarked
                                ? AppConfig.primaryColor
                                : Colors.grey.shade600,
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
                          color: Colors.grey.shade600,
                        ),
                      ),
                      const SizedBox(height: 12),
                      _StatsRibbon(article: article, views: item.views),
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

class _StatsRibbon extends StatelessWidget {
  final Article article;
  final int views;

  const _StatsRibbon({required this.article, required this.views});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: AppConfig.surfaceColor,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Wrap(
        spacing: 14,
        runSpacing: 6,
        children: [
          _Stat(
            icon: Icons.visibility_outlined,
            label: '${TrendingMock.formatViews(views)} views',
          ),
          _Stat(
            icon: Icons.access_time,
            label: '${article.readTimeMinutes} min read',
          ),
          _Stat(
            icon: Icons.schedule,
            label: timeago.format(article.publishedAt),
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
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: Colors.grey.shade500),
        const SizedBox(width: 4),
        Text(
          label,
          style: AppTheme.body(12, FontWeight.w500, color: Colors.grey.shade600),
        ),
      ],
    );
  }
}

class _RankedTile extends StatelessWidget {
  final TrendingItem item;

  const _RankedTile({required this.item});

  @override
  Widget build(BuildContext context) {
    final article = item.article;
    final bookmarks = context.watch<BookmarksProvider>();
    final isBookmarked = bookmarks.isBookmarked(article.id);

    return GestureDetector(
      onTap: () => context.push('/article/${article.id}', extra: article),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
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
                '#${item.rank}',
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
                  color: Colors.grey.shade100,
                ),
                errorWidget: (_, _, _) => Container(
                  width: 72,
                  height: 72,
                  color: Colors.grey.shade100,
                  child: const Icon(Icons.image_not_supported_outlined,
                      color: Colors.grey),
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
                          '${TrendingMock.formatViews(item.views)} views · ${article.source}',
                          style: AppTheme.body(
                            12,
                            FontWeight.w400,
                            color: Colors.grey.shade500,
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
                              : Colors.grey.shade400,
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
