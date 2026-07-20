import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../config/app_config.dart';
import '../../core/providers/bookmarks_provider.dart';
import '../../shared/widgets/article_list_tile.dart';

class BookmarksScreen extends StatelessWidget {
  const BookmarksScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final bookmarks = context.watch<BookmarksProvider>();
    final articles = bookmarks.bookmarks;

    return Scaffold(
      backgroundColor: AppConfig.surfaceColor,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text(
          'Bookmarks',
          style: TextStyle(
            color: AppConfig.primaryColor,
            fontWeight: FontWeight.w800,
          ),
        ),
        actions: [
          if (articles.isNotEmpty)
            TextButton(
              onPressed: () => _confirmClearAll(context, bookmarks),
              child: const Text(
                'Clear all',
                style: TextStyle(color: Colors.grey),
              ),
            ),
        ],
      ),
      body: articles.isEmpty
          ? _EmptyBookmarks(onExploreTap: () => context.go('/categories'))
          : ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: articles.length,
              itemBuilder: (context, index) {
                final article = articles[index];
                return Dismissible(
                  key: Key(article.id),
                  direction: DismissDirection.endToStart,
                  background: Container(
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.only(right: 20),
                    color: Colors.red.shade400,
                    child:
                        const Icon(Icons.delete_outline, color: Colors.white),
                  ),
                  onDismissed: (_) =>
                      bookmarks.removeBookmark(article.id),
                  child: ArticleListTile(article: article),
                );
              },
            ),
    );
  }

  Future<void> _confirmClearAll(
      BuildContext context, BookmarksProvider bookmarks) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Clear all bookmarks?'),
        content: const Text(
            'This will remove all your saved articles. This cannot be undone.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child:
                const Text('Clear all', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
    if (confirmed == true) {
      for (final article in List.from(bookmarks.bookmarks)) {
        await bookmarks.removeBookmark(article.id);
      }
    }
  }
}

class _EmptyBookmarks extends StatelessWidget {
  final VoidCallback onExploreTap;

  const _EmptyBookmarks({required this.onExploreTap});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.bookmark_outline,
              size: 72,
              color: Colors.grey.shade300,
            ),
            const SizedBox(height: 16),
            const Text(
              'No saved articles yet',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Tap the bookmark icon on any article\nto save it for later.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600, height: 1.5),
            ),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: onExploreTap,
              icon: const Icon(Icons.explore_outlined, size: 18),
              label: const Text('Explore Categories'),
            ),
          ],
        ),
      ),
    );
  }
}
