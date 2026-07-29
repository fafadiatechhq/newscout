import 'package:flutter/material.dart';

import '../../config/app_config.dart';
import '../models/article.dart';
import '../models/category.dart';
import 'api_client.dart';
import 'news_service.dart';

/// Live [NewsService] backed by the Django `/api/v1` endpoints.
class ApiNewsService implements NewsService {
  ApiNewsService(this._client);

  final ApiClient _client;

  static const _brandTeal = Color(0xFF2E7D7D);

  static final Map<String, IconData> _categoryIcons = {
    'trending': Icons.trending_up,
    'sector': Icons.public,
    'regional': Icons.language,
    'finance': Icons.storage,
    'economics': Icons.bar_chart,
    'misc': Icons.developer_board,
    'rss': Icons.rss_feed,
    'technology': Icons.memory,
    'world': Icons.public,
    'business': Icons.business_center,
    'sports': Icons.sports_soccer,
    'politics': Icons.account_balance,
  };

  @override
  Future<List<NewsCategory>> getCategories() async {
    final response = await _client.get('/categories/', auth: false);
    final data = _client.decode(response);
    final results = _extractResults(data);
    return results.map(_categoryFromJson).toList();
  }

  @override
  Future<List<Article>> getArticles({
    String? categoryId,
    int limit = 20,
    int offset = 0,
  }) async {
    final query = <String, String>{
      'limit': '$limit',
      'offset': '$offset',
    };
    if (categoryId != null && categoryId.isNotEmpty) {
      query['category_id'] = categoryId;
    }
    final response = await _client.get(
      '/articles/',
      query: query,
      auth: false,
    );
    final data = _client.decode(response);
    return _extractResults(data).map(Article.fromApiJson).toList();
  }

  @override
  Future<List<Article>> getBreakingNews() async {
    final response = await _client.get(
      '/articles/',
      query: {
        'is_breaking': 'true',
        'limit': '${AppConfig.articlesPerPage}',
        'offset': '0',
      },
      auth: false,
    );
    final data = _client.decode(response);
    return _extractResults(data).map(Article.fromApiJson).toList();
  }

  @override
  Future<List<Article>> getTrendingArticles({int limit = 20}) async {
    final response = await _client.get(
      '/articles/',
      query: {
        'trending': 'true',
        'limit': '$limit',
        'offset': '0',
      },
      auth: false,
    );
    final data = _client.decode(response);
    return _extractResults(data).map(Article.fromApiJson).toList();
  }

  @override
  Future<List<Article>> searchArticles(String query) async {
    if (query.trim().isEmpty) return [];
    final response = await _client.get(
      '/articles/',
      query: {
        'search': query.trim(),
        'limit': '${AppConfig.articlesPerPage}',
        'offset': '0',
      },
      auth: false,
    );
    final data = _client.decode(response);
    return _extractResults(data).map(Article.fromApiJson).toList();
  }

  @override
  Future<Article> getArticle(String id) async {
    final response = await _client.get('/articles/$id/', auth: false);
    final data = _client.decode(response) as Map<String, dynamic>;
    return Article.fromApiJson(data);
  }

  List<Map<String, dynamic>> _extractResults(dynamic data) {
    if (data is List) {
      return data.cast<Map<String, dynamic>>();
    }
    if (data is Map<String, dynamic>) {
      final results = data['results'];
      if (results is List) {
        return results.cast<Map<String, dynamic>>();
      }
    }
    return const [];
  }

  NewsCategory _categoryFromJson(Map<String, dynamic> json) {
    final id = '${json['id']}';
    final name = (json['name'] as String?) ?? 'Category';
    final key = name.toLowerCase();
    IconData icon = Icons.article_outlined;
    for (final entry in _categoryIcons.entries) {
      if (key.contains(entry.key)) {
        icon = entry.value;
        break;
      }
    }
    return NewsCategory(
      id: id,
      name: name,
      icon: icon,
      color: _brandTeal,
    );
  }
}
