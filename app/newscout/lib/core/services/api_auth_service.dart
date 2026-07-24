import '../models/user.dart';
import 'api_client.dart';
import 'auth_service.dart';

/// JWT auth against Django `/api/v1/auth/*` endpoints.
class ApiAuthService implements AuthService {
  ApiAuthService(this._client);

  final ApiClient _client;

  @override
  Future<AppUser> login(String email, String password) async {
    final response = await _client.post(
      '/auth/login/',
      body: {'email': email.trim(), 'password': password},
      auth: false,
    );
    final data = _client.decode(response) as Map<String, dynamic>;
    await _persistTokens(data);
    return AppUser.fromApiJson(data['user'] as Map<String, dynamic>);
  }

  @override
  Future<AppUser> signup(String name, String email, String password) async {
    final response = await _client.post(
      '/auth/signup/',
      body: {
        'name': name.trim(),
        'email': email.trim(),
        'password': password,
      },
      auth: false,
    );
    final data = _client.decode(response) as Map<String, dynamic>;
    await _persistTokens(data);
    return AppUser.fromApiJson(data['user'] as Map<String, dynamic>);
  }

  @override
  Future<void> logout() async {
    try {
      if (_client.accessToken != null) {
        await _client.post('/auth/logout/');
      }
    } catch (_) {
      // Best-effort; always clear local tokens.
    } finally {
      await _client.clearTokens();
    }
  }

  @override
  Future<AppUser?> getCurrentUser() async {
    if (_client.accessToken == null) return null;
    try {
      final response = await _client.get('/auth/me/');
      final data = _client.decode(response) as Map<String, dynamic>;
      return AppUser.fromApiJson(data);
    } on ApiException catch (e) {
      if (e.statusCode == 401) {
        await _client.clearTokens();
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  Future<void> _persistTokens(Map<String, dynamic> data) async {
    final access = data['access'] as String?;
    final refresh = data['refresh'] as String?;
    if (access == null || refresh == null) {
      throw ApiException('Auth response missing tokens');
    }
    await _client.saveTokens(access: access, refresh: refresh);
  }
}
