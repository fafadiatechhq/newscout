import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../config/app_config.dart';

/// Thin HTTP client for the NewScout Django API.
/// Attaches JWT Bearer tokens when present and persists them in SharedPreferences.
/// On 401, refreshes the access token once and retries the original request.
class ApiClient {
  ApiClient(this._prefs, {http.Client? httpClient})
      : _http = httpClient ?? http.Client();

  static const _accessKey = 'ns_access_token';
  static const _refreshKey = 'ns_refresh_token';

  final SharedPreferences _prefs;
  final http.Client _http;

  /// Prevents concurrent refresh storms; only one refresh runs at a time.
  Future<bool>? _refreshInFlight;

  String get _base => AppConfig.baseApiUrl.replaceAll(RegExp(r'/$'), '');

  String? get accessToken => _prefs.getString(_accessKey);
  String? get refreshToken => _prefs.getString(_refreshKey);

  Future<void> saveTokens({required String access, required String refresh}) async {
    await _prefs.setString(_accessKey, access);
    await _prefs.setString(_refreshKey, refresh);
  }

  Future<void> clearTokens() async {
    await _prefs.remove(_accessKey);
    await _prefs.remove(_refreshKey);
  }

  Uri _uri(String path, [Map<String, String>? query]) {
    final normalized = path.startsWith('/') ? path : '/$path';
    return Uri.parse('$_base$normalized').replace(queryParameters: query);
  }

  Map<String, String> _headers({bool auth = true, bool json = true}) {
    final headers = <String, String>{};
    if (json) headers['Content-Type'] = 'application/json';
    if (auth) {
      final token = accessToken;
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  /// Exchange refresh token for a new access token.
  /// Returns true on success; clears tokens and returns false on failure.
  Future<bool> refreshAccessToken() async {
    if (_refreshInFlight != null) return _refreshInFlight!;

    _refreshInFlight = _doRefresh();
    try {
      return await _refreshInFlight!;
    } finally {
      _refreshInFlight = null;
    }
  }

  Future<bool> _doRefresh() async {
    final refresh = refreshToken;
    if (refresh == null || refresh.isEmpty) {
      await clearTokens();
      return false;
    }

    try {
      final response = await _http.post(
        _uri('/auth/token/refresh/'),
        headers: _headers(auth: false),
        body: jsonEncode({'refresh': refresh}),
      );
      if (response.statusCode < 200 || response.statusCode >= 300) {
        await clearTokens();
        return false;
      }
      final body = jsonDecode(response.body) as Map<String, dynamic>;
      final access = body['access'] as String?;
      if (access == null || access.isEmpty) {
        await clearTokens();
        return false;
      }
      final newRefresh = (body['refresh'] as String?) ?? refresh;
      await saveTokens(access: access, refresh: newRefresh);
      return true;
    } catch (_) {
      await clearTokens();
      return false;
    }
  }

  Future<http.Response> _withAuthRetry(
    Future<http.Response> Function() send, {
    required bool auth,
  }) async {
    var response = await send();
    if (auth && response.statusCode == 401) {
      final refreshed = await refreshAccessToken();
      if (refreshed) {
        response = await send();
      }
    }
    return response;
  }

  Future<http.Response> get(
    String path, {
    Map<String, String>? query,
    bool auth = true,
  }) {
    return _withAuthRetry(
      () => _http.get(_uri(path, query), headers: _headers(auth: auth)),
      auth: auth,
    );
  }

  Future<http.Response> post(
    String path, {
    Object? body,
    bool auth = true,
  }) {
    return _withAuthRetry(
      () => _http.post(
        _uri(path),
        headers: _headers(auth: auth),
        body: body == null ? null : jsonEncode(body),
      ),
      auth: auth,
    );
  }

  Future<http.Response> delete(String path, {bool auth = true}) {
    return _withAuthRetry(
      () => _http.delete(_uri(path), headers: _headers(auth: auth)),
      auth: auth,
    );
  }

  /// Decode JSON body; throws [ApiException] on non-2xx.
  dynamic decode(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return null;
      return jsonDecode(response.body);
    }
    throw ApiException.fromResponse(response);
  }
}

class ApiException implements Exception {
  ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  factory ApiException.fromResponse(http.Response response) {
    String message = 'Request failed (${response.statusCode})';
    try {
      final body = jsonDecode(response.body);
      if (body is Map) {
        if (body['detail'] != null) {
          message = body['detail'].toString();
        } else if (body.values.isNotEmpty) {
          final first = body.values.first;
          if (first is List && first.isNotEmpty) {
            message = first.first.toString();
          } else if (first is String) {
            message = first;
          } else if (body.length == 1) {
            message = '${body.keys.first}: $first';
          }
        }
      }
    } catch (_) {
      if (response.body.isNotEmpty) message = response.body;
    }
    return ApiException(message, statusCode: response.statusCode);
  }

  @override
  String toString() => message;
}
