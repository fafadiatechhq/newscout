import 'package:flutter/foundation.dart';

import '../models/article.dart';
import '../services/news_service.dart';

/// Provides trending articles from the API.
///
/// The period chip filter (Now / Today / Week) is applied client-side by
/// comparing [Article.publishedAt] against fixed time windows so no extra
/// network call is needed when the user switches periods.
class TrendingProvider extends ChangeNotifier {
  TrendingProvider(this._service);

  final NewsService _service;

  List<Article> _articles = [];
  bool _isLoading = false;
  String? _error;

  List<Article> get articles => _articles;
  bool get isLoading => _isLoading;
  String? get error => _error;

  /// Trending articles published in the last [hours] hours.
  List<Article> articlesForPeriod({required int hours}) {
    final cutoff = DateTime.now().subtract(Duration(hours: hours));
    return _articles
        .where((a) => a.publishedAt.isAfter(cutoff))
        .toList();
  }

  Future<void> load({bool refresh = false}) async {
    if (_isLoading) return;
    if (_articles.isNotEmpty && !refresh) return;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _articles = await _service.getTrendingArticles(limit: 30);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
