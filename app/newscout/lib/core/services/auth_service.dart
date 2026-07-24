import '../models/user.dart';

/// Abstract auth contract. Implemented by [ApiAuthService] (JWT) and MockAuthService.
abstract class AuthService {
  Future<AppUser> login(String email, String password);
  Future<AppUser> signup(String name, String email, String password);
  Future<void> logout();
  Future<AppUser?> getCurrentUser();
}

/// Mock auth that accepts any credentials and returns a fake user.
class MockAuthService implements AuthService {
  static AppUser? _loggedInUser;

  @override
  Future<AppUser> login(String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 800));
    if (email.isEmpty || password.isEmpty) {
      throw Exception('Email and password are required.');
    }
    _loggedInUser = AppUser(
      id: 'user-${email.hashCode.abs()}',
      name: email.split('@').first.replaceAll('.', ' ').split(' ').map((s) {
        if (s.isEmpty) return s;
        return s[0].toUpperCase() + s.substring(1);
      }).join(' '),
      email: email,
      preferredCategoryIds: const ['technology', 'world'],
    );
    return _loggedInUser!;
  }

  @override
  Future<AppUser> signup(String name, String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 1000));
    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      throw Exception('All fields are required.');
    }
    _loggedInUser = AppUser(
      id: 'user-${email.hashCode.abs()}',
      name: name,
      email: email,
      preferredCategoryIds: const [],
    );
    return _loggedInUser!;
  }

  @override
  Future<void> logout() async {
    await Future.delayed(const Duration(milliseconds: 200));
    _loggedInUser = null;
  }

  @override
  Future<AppUser?> getCurrentUser() async {
    return _loggedInUser;
  }
}
