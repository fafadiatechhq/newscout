import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/article.dart';

class BookmarksProvider extends ChangeNotifier {
  static const String _prefsKey = 'ns_bookmarks';

  final SharedPreferences _prefs;
  List<Article> _bookmarks = [];

  BookmarksProvider(this._prefs) {
    _load();
  }

  List<Article> get bookmarks => List.unmodifiable(_bookmarks);

  bool isBookmarked(String articleId) =>
      _bookmarks.any((a) => a.id == articleId);

  Future<void> toggleBookmark(Article article) async {
    if (isBookmarked(article.id)) {
      _bookmarks.removeWhere((a) => a.id == article.id);
    } else {
      _bookmarks.insert(0, article);
    }
    notifyListeners();
    await _persist();
  }

  Future<void> removeBookmark(String articleId) async {
    _bookmarks.removeWhere((a) => a.id == articleId);
    notifyListeners();
    await _persist();
  }

  void _load() {
    final raw = _prefs.getString(_prefsKey);
    if (raw == null) return;
    try {
      final list = jsonDecode(raw) as List<dynamic>;
      _bookmarks = list
          .map((j) => Article.fromJson(j as Map<String, dynamic>))
          .toList();
      notifyListeners();
    } catch (_) {
      // Corrupt data – start fresh
      _bookmarks = [];
    }
  }

  Future<void> _persist() async {
    final data = jsonEncode(_bookmarks.map((a) => a.toJson()).toList());
    await _prefs.setString(_prefsKey, data);
  }
}
