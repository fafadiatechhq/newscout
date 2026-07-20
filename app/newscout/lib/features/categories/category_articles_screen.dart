import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/app_config.dart';
import '../../core/providers/news_provider.dart';
import '../../shared/widgets/article_list_tile.dart';
import '../../shared/widgets/shimmer_loading.dart';

class CategoryArticlesScreen extends StatefulWidget {
  final String categoryId;

  const CategoryArticlesScreen({super.key, required this.categoryId});

  @override
  State<CategoryArticlesScreen> createState() => _CategoryArticlesScreenState();
}

class _CategoryArticlesScreenState extends State<CategoryArticlesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<NewsProvider>().loadCategoryArticles(widget.categoryId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final news = context.watch<NewsProvider>();
    final category = news.categoryById(widget.categoryId);
    final articles = news.categoryArticles(widget.categoryId);
    final isLoading = news.isLoadingCategory(widget.categoryId);

    return Scaffold(
      backgroundColor: AppConfig.surfaceColor,
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: const BackButton(color: AppConfig.primaryColor),
        titleTextStyle: const TextStyle(
          color: AppConfig.primaryColor,
          fontWeight: FontWeight.w700,
          fontSize: 18,
        ),
        title: category != null
            ? Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(category.icon,
                      color: AppConfig.primaryColor, size: 18),
                  const SizedBox(width: 8),
                  Text(category.name),
                ],
              )
            : const Text('Articles'),
      ),
      body: RefreshIndicator(
        color: AppConfig.primaryColor,
        onRefresh: () =>
            context.read<NewsProvider>().loadCategoryArticles(widget.categoryId),
        child: isLoading
            ? ListView.builder(
                itemCount: 6,
                itemBuilder: (_, _) => const ArticleTileShimmer(),
              )
            : articles.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.article_outlined,
                            size: 48, color: Colors.grey.shade400),
                        const SizedBox(height: 12),
                        Text(
                          'No articles found',
                          style: TextStyle(color: Colors.grey.shade600),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: articles.length,
                    itemBuilder: (context, index) {
                      return ArticleListTile(article: articles[index]);
                    },
                  ),
      ),
    );
  }
}
