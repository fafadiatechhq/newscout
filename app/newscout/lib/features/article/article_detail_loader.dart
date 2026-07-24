import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/app_config.dart';
import '../../core/models/article.dart';
import '../../core/providers/news_provider.dart';
import 'article_detail_screen.dart';

/// Loads an article by id when navigating to `/article/:id` without `extra`.
class ArticleDetailLoader extends StatefulWidget {
  final String articleId;

  const ArticleDetailLoader({super.key, required this.articleId});

  @override
  State<ArticleDetailLoader> createState() => _ArticleDetailLoaderState();
}

class _ArticleDetailLoaderState extends State<ArticleDetailLoader> {
  Future<Article>? _future;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _future ??= context.read<NewsProvider>().getArticle(widget.articleId);
  }

  @override
  Widget build(BuildContext context) {
    final future = _future;
    if (future == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return FutureBuilder<Article>(
      future: future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        if (snapshot.hasError || !snapshot.hasData) {
          return Scaffold(
            appBar: AppBar(title: Text(AppConfig.appName)),
            body: Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      snapshot.error?.toString() ?? 'Article not found',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: () => Navigator.of(context).maybePop(),
                      child: const Text('Go back'),
                    ),
                  ],
                ),
              ),
            ),
          );
        }
        return ArticleDetailScreen(article: snapshot.data!);
      },
    );
  }
}
