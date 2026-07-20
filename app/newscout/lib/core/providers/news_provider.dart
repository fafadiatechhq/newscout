import 'package:flutter/foundation.dart';

import '../models/article.dart';
import '../models/category.dart';
import '../services/news_service.dart';

class NewsProvider extends ChangeNotifier {
  final NewsService _service;

  NewsProvider(this._service);

  // ── State ─────────────────────────────────────────────────────────────────
  List<Article> _homeArticles = [];
  List<Article> _breakingNews = [];
  List<NewsCategory> _categories = [];
  final Map<String, List<Article>> _categoryArticles = {};
  List<Article> _searchResults = [];

  bool _isLoadingHome = false;
  bool _isLoadingBreaking = false;
  bool _isLoadingCategories = false;
  final Map<String, bool> _isLoadingCategory = {};
  bool _isSearching = false;

  String? _error;

  // ── Getters ───────────────────────────────────────────────────────────────
  List<Article> get homeArticles => _homeArticles;
  List<Article> get breakingNews => _breakingNews;
  List<NewsCategory> get categories => _categories;
  List<Article> get searchResults => _searchResults;

  bool get isLoadingHome => _isLoadingHome;
  bool get isLoadingBreaking => _isLoadingBreaking;
  bool get isLoadingCategories => _isLoadingCategories;
  bool get isSearching => _isSearching;

  String? get error => _error;

  List<Article> categoryArticles(String categoryId) =>
      _categoryArticles[categoryId] ?? [];

  bool isLoadingCategory(String categoryId) =>
      _isLoadingCategory[categoryId] ?? false;

  NewsCategory? categoryById(String id) {
    try {
      return _categories.firstWhere((c) => c.id == id);
    } catch (_) {
      return null;
    }
  }

  /// Articles from the same category, excluding the current article.
  List<Article> relatedArticles(String categoryId, String excludeId,
      {int limit = 5}) {
    return categoryArticles(categoryId)
        .where((a) => a.id != excludeId)
        .take(limit)
        .toList();
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  Future<void> loadHome() async {
    if (_isLoadingHome) return;
    _isLoadingHome = true;
    _error = null;
    notifyListeners();

    try {
      _homeArticles = await _service.getArticles(limit: 20);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoadingHome = false;
      notifyListeners();
    }
  }

  Future<void> loadBreakingNews() async {
    if (_isLoadingBreaking) return;
    _isLoadingBreaking = true;
    notifyListeners();

    try {
      _breakingNews = await _service.getBreakingNews();
    } catch (_) {
      // Non-critical; home still shows without breaking news
    } finally {
      _isLoadingBreaking = false;
      notifyListeners();
    }
  }

  Future<void> loadCategories() async {
    if (_isLoadingCategories) return;
    _isLoadingCategories = true;
    notifyListeners();

    try {
      _categories = await _service.getCategories();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoadingCategories = false;
      notifyListeners();
    }
  }

  Future<void> loadCategoryArticles(String categoryId) async {
    if (_isLoadingCategory[categoryId] == true) return;
    _isLoadingCategory[categoryId] = true;
    notifyListeners();

    try {
      _categoryArticles[categoryId] =
          await _service.getArticles(categoryId: categoryId);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoadingCategory[categoryId] = false;
      notifyListeners();
    }
  }

  Future<void> search(String query) async {
    if (query.trim().isEmpty) {
      _searchResults = [];
      notifyListeners();
      return;
    }
    _isSearching = true;
    notifyListeners();

    try {
      _searchResults = await _service.searchArticles(query);
    } catch (e) {
      _searchResults = [];
    } finally {
      _isSearching = false;
      notifyListeners();
    }
  }

  void clearSearch() {
    _searchResults = [];
    notifyListeners();
  }
}
