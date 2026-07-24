import '../models/article.dart';
import 'api_client.dart';

/// A server bookmark row: Django bookmark PK + nested article.
class BookmarkEntry {
  const BookmarkEntry({
    required this.bookmarkId,
    required this.article,
  });

  final String bookmarkId;
  final Article article;
}

/// Live bookmark API backed by Django `/api/v1/bookmarks/`.
class ApiBookmarkService {
  ApiBookmarkService(this._client);

  final ApiClient _client;

  Future<List<BookmarkEntry>> list() async {
    final response = await _client.get('/bookmarks/');
    final data = _client.decode(response);
    final results = _extractResults(data);
    return results.map(_entryFromJson).toList();
  }

  /// Creates a bookmark for [articleId]. Returns the new bookmark PK.
  Future<String> create(String articleId) async {
    final response = await _client.post(
      '/bookmarks/',
      body: {'article_id': int.parse(articleId)},
    );
    final data = _client.decode(response) as Map<String, dynamic>;
    return '${data['id']}';
  }

  Future<void> delete(String bookmarkId) async {
    final response = await _client.delete('/bookmarks/$bookmarkId/');
    _client.decode(response);
  }

  BookmarkEntry _entryFromJson(Map<String, dynamic> json) {
    final articleJson = json['article'] as Map<String, dynamic>;
    return BookmarkEntry(
      bookmarkId: '${json['id']}',
      article: Article.fromApiJson(articleJson),
    );
  }

  List<Map<String, dynamic>> _extractResults(dynamic data) {
    if (data is List) {
      return data.cast<Map<String, dynamic>>();
    }
    if (data is Map && data['results'] is List) {
      return (data['results'] as List).cast<Map<String, dynamic>>();
    }
    return const [];
  }
}
