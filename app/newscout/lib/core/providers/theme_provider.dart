import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Persists and exposes the user's theme preference (light / dark / system).
class ThemeProvider extends ChangeNotifier {
  static const _key = 'ns_theme_mode';

  ThemeProvider._(this._prefs, this._mode);

  final SharedPreferences _prefs;
  ThemeMode _mode;

  ThemeMode get mode => _mode;

  static Future<ThemeProvider> create(SharedPreferences prefs) async {
    final saved = prefs.getString(_key);
    final mode = _parseMode(saved);
    final provider = ThemeProvider._(prefs, mode);
    provider._applySystemUi(mode);
    return provider;
  }

  static ThemeMode _parseMode(String? value) {
    return switch (value) {
      'light' => ThemeMode.light,
      'dark' => ThemeMode.dark,
      _ => ThemeMode.system,
    };
  }

  Future<void> setMode(ThemeMode mode) async {
    if (_mode == mode) return;
    _mode = mode;
    await _prefs.setString(_key, mode.name);
    _applySystemUi(mode);
    notifyListeners();
  }

  void _applySystemUi(ThemeMode mode) {
    final isDark = switch (mode) {
      ThemeMode.dark => true,
      ThemeMode.light => false,
      ThemeMode.system =>
        WidgetsBinding.instance.platformDispatcher.platformBrightness ==
            Brightness.dark,
    };

    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
        statusBarBrightness: isDark ? Brightness.dark : Brightness.light,
      ),
    );
  }
}
