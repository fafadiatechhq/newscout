import 'package:flutter/foundation.dart';

import '../models/user.dart';
import '../services/auth_service.dart';

typedef AuthChangedCallback = Future<void> Function({required bool isAuthenticated});

class AuthProvider extends ChangeNotifier {
  final AuthService _service;
  final AuthChangedCallback? onAuthChanged;

  AuthProvider(this._service, {this.onAuthChanged});

  AppUser? _currentUser;
  bool _isLoading = false;
  String? _error;

  AppUser? get currentUser => _currentUser;
  bool get isLoggedIn => _currentUser != null;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> checkAuthState() async {
    _currentUser = await _service.getCurrentUser();
    notifyListeners();
    await _notifyAuthChanged();
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _currentUser = await _service.login(email, password);
      await _notifyAuthChanged();
      return true;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> signup(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _currentUser = await _service.signup(name, email, password);
      await _notifyAuthChanged();
      return true;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _service.logout();
    _currentUser = null;
    notifyListeners();
    await _notifyAuthChanged();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  Future<void> _notifyAuthChanged() async {
    final callback = onAuthChanged;
    if (callback == null) return;
    await callback(isAuthenticated: isLoggedIn);
  }
}
