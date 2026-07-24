import '../models/article.dart';
import '../models/category.dart';

/// Abstract contract for news data.
/// Implemented by [ApiNewsService] (Django) and MockNewsService.
abstract class NewsService {
  Future<List<NewsCategory>> getCategories();

  Future<List<Article>> getArticles({
    String? categoryId,
    int limit = 20,
    int offset = 0,
  });

  Future<List<Article>> getBreakingNews();

  Future<List<Article>> searchArticles(String query);

  Future<Article> getArticle(String id);
}
