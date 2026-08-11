import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

/// Skeleton card shown while articles are loading.
class ArticleCardShimmer extends StatelessWidget {
  const ArticleCardShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final shimmer = _shimmerColors(context);

    return Shimmer.fromColors(
      baseColor: shimmer.base,
      highlightColor: shimmer.highlight,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 190,
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(12)),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _box(context, height: 14, width: double.infinity),
                  const SizedBox(height: 6),
                  _box(context, height: 14, width: 240),
                  const SizedBox(height: 12),
                  _box(context, height: 11, width: 140),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Skeleton list tile shown while article lists are loading.
class ArticleTileShimmer extends StatelessWidget {
  const ArticleTileShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final shimmer = _shimmerColors(context);

    return Shimmer.fromColors(
      baseColor: shimmer.base,
      highlightColor: shimmer.highlight,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Container(
              width: 88,
              height: 88,
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _box(context, height: 13, width: double.infinity),
                  const SizedBox(height: 6),
                  _box(context, height: 13, width: 200),
                  const SizedBox(height: 6),
                  _box(context, height: 13, width: 140),
                  const SizedBox(height: 10),
                  _box(context, height: 11, width: 100),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Skeleton for the breaking news carousel card.
class BreakingNewsShimmer extends StatelessWidget {
  const BreakingNewsShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final shimmer = _shimmerColors(context);

    return Shimmer.fromColors(
      baseColor: shimmer.base,
      highlightColor: shimmer.highlight,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
        ),
        height: 200,
      ),
    );
  }
}

class _ShimmerColors {
  final Color base;
  final Color highlight;

  const _ShimmerColors({required this.base, required this.highlight});
}

_ShimmerColors _shimmerColors(BuildContext context) {
  final isDark = Theme.of(context).brightness == Brightness.dark;
  return _ShimmerColors(
    base: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
    highlight: isDark ? Colors.grey.shade700 : Colors.grey.shade50,
  );
}

Widget _box(BuildContext context,
    {required double height, required double width}) {
  return Container(
    height: height,
    width: width,
    decoration: BoxDecoration(
      color: Theme.of(context).colorScheme.surface,
      borderRadius: BorderRadius.circular(4),
    ),
  );
}
