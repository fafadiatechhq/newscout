import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:timeago/timeago.dart' as timeago;

import '../../../config/app_config.dart';
import '../../../config/app_theme.dart';
import '../../../core/models/article.dart';
import '../../../core/models/category.dart';
import '../../../core/providers/bookmarks_provider.dart';

/// Large article card used in the Home feed.
class ArticleCard extends StatelessWidget {
  final Article article;
  final NewsCategory? category;

  const ArticleCard({super.key, required this.article, this.category});

  @override
  Widget build(BuildContext context) {
    final bookmarks = context.watch<BookmarksProvider>();
    final isBookmarked = bookmarks.isBookmarked(article.id);
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: () => context.push('/article/${article.id}', extra: article),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Image with category chip overlay ────────────────────────
            Stack(
              children: [
                ClipRRect(
                  borderRadius:
                      const BorderRadius.vertical(top: Radius.circular(16)),
                  child: CachedNetworkImage(
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
                ),
                if (category != null)
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: category!.color,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(category!.icon,
                              color: Colors.white, size: 12),
                          const SizedBox(width: 4),
                          Text(
                            category!.name,
                            style: AppTheme.body(11, FontWeight.w700, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ),
                // Bookmark button
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

            // ── Text content ─────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    article.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppTheme.headline(16, FontWeight.w700, height: 1.3),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    article.summary,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: Colors.grey.shade600,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Icon(Icons.newspaper_outlined,
                          size: 13, color: Colors.grey.shade500),
                      const SizedBox(width: 4),
                      Text(
                        article.source,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: Colors.grey.shade500,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        width: 3,
                        height: 3,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade400,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        timeago.format(article.publishedAt),
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: Colors.grey.shade500,
                        ),
                      ),
                      const Spacer(),
                      Icon(Icons.access_time,
                          size: 12, color: Colors.grey.shade400),
                      const SizedBox(width: 3),
                      Text(
                        '${article.readTimeMinutes} min',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: Colors.grey.shade400,
                          fontSize: 11,
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
