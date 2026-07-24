import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/article.dart';
import '../services/api_bookmark_service.dart';

class BookmarksProvider extends ChangeNotifier {
  static const String _prefsKey = 'ns_bookmarks';
  static const String _idsKey = 'ns_bookmark_ids';

  final SharedPreferences _prefs;
  final ApiBookmarkService? api;

  List<Article> _bookmarks = [];
  /// Maps article id → server bookmark id (only when synced with API).
  Map<String, String> _bookmarkIds = {};
  bool _isAuthenticated = false;
  bool _isSyncing = false;
  String? _error;

  BookmarksProvider(this._prefs, {this.api}) {
    _load();
  }

  List<Article> get bookmarks => List.unmodifiable(_bookmarks);
  bool get isSyncing => _isSyncing;
  String? get error => _error;

  bool isBookmarked(String articleId) =>
      _bookmarks.any((a) => a.id == articleId);

  /// Called when auth state changes. Syncs from server on login; local cache
  /// is kept on logout.
  Future<void> onAuthChanged({required bool isAuthenticated}) async {
    _isAuthenticated = isAuthenticated;
    if (isAuthenticated) {
      await syncFromServer();
    }
  }

  Future<void> syncFromServer() async {
    final bookmarkApi = api;
    if (bookmarkApi == null || !_isAuthenticated) return;
    if (_isSyncing) return;

    _isSyncing = true;
    _error = null;
    notifyListeners();

    try {
      final entries = await bookmarkApi.list();
      _bookmarks = entries.map((e) => e.article).toList();
      _bookmarkIds = {
        for (final e in entries) e.article.id: e.bookmarkId,
      };
      await _persist();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isSyncing = false;
      notifyListeners();
    }
  }

  Future<void> toggleBookmark(Article article) async {
    if (isBookmarked(article.id)) {
      await removeBookmark(article.id);
      return;
    }

    _bookmarks.insert(0, article);
    notifyListeners();
    await _persist();

    final bookmarkApi = api;
    if (bookmarkApi != null && _isAuthenticated) {
      try {
        final bookmarkId = await bookmarkApi.create(article.id);
        _bookmarkIds[article.id] = bookmarkId;
        await _persist();
      } catch (e) {
        _bookmarks.removeWhere((a) => a.id == article.id);
        _bookmarkIds.remove(article.id);
        _error = e.toString();
        notifyListeners();
        await _persist();
      }
    }
  }

  Future<void> removeBookmark(String articleId) async {
    final previousIndex = _bookmarks.indexWhere((a) => a.id == articleId);
    if (previousIndex < 0) return;

    final previous = _bookmarks[previousIndex];
    final previousBookmarkId = _bookmarkIds[articleId];

    _bookmarks.removeAt(previousIndex);
    _bookmarkIds.remove(articleId);
    notifyListeners();
    await _persist();

    final bookmarkApi = api;
    if (bookmarkApi != null && _isAuthenticated && previousBookmarkId != null) {
      try {
        await bookmarkApi.delete(previousBookmarkId);
      } catch (e) {
        _bookmarks.insert(previousIndex.clamp(0, _bookmarks.length), previous);
        _bookmarkIds[articleId] = previousBookmarkId;
        _error = e.toString();
        notifyListeners();
        await _persist();
      }
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void _load() {
    final raw = _prefs.getString(_prefsKey);
    if (raw != null) {
      try {
        final list = jsonDecode(raw) as List<dynamic>;
        _bookmarks = list
            .map((j) => Article.fromJson(j as Map<String, dynamic>))
            .toList();
      } catch (_) {
        _bookmarks = [];
      }
    }

    final idsRaw = _prefs.getString(_idsKey);
    if (idsRaw != null) {
      try {
        final map = jsonDecode(idsRaw) as Map<String, dynamic>;
        _bookmarkIds = map.map((k, v) => MapEntry(k, '$v'));
      } catch (_) {
        _bookmarkIds = {};
      }
    }
    notifyListeners();
  }

  Future<void> _persist() async {
    final data = jsonEncode(_bookmarks.map((a) => a.toJson()).toList());
    await _prefs.setString(_prefsKey, data);
    await _prefs.setString(_idsKey, jsonEncode(_bookmarkIds));
  }
}
