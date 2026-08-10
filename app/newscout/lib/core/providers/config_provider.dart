import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../config/app_config.dart';

/// Stores runtime-configurable app settings, persisted across launches.
/// The base API URL can be changed while the app is running — ApiClient
/// reads from this provider on every request, so changes take effect immediately.
class ConfigProvider extends ChangeNotifier {
  static const _baseUrlKey = 'ns_config_base_url_v2';

  ConfigProvider._(this._prefs, this._baseUrl);

  final SharedPreferences _prefs;
  String _baseUrl;

  String get baseUrl => _baseUrl;

  bool get needsServerUrlSetup => _baseUrl.isEmpty;

  static Future<ConfigProvider> create(SharedPreferences prefs) async {
    final saved = prefs.getString(_baseUrlKey);
    if (saved != null && saved.isNotEmpty) {
      return ConfigProvider._(prefs, saved);
    }

    final resolved = await AppConfig.resolveBaseApiUrl();
    return ConfigProvider._(prefs, resolved);
  }

  Future<void> setBaseUrl(String url) async {
    final trimmed = url.trim().replaceAll(RegExp(r'/$'), '');
    if (trimmed.isEmpty || trimmed == _baseUrl) return;
    _baseUrl = trimmed;
    await _prefs.setString(_baseUrlKey, trimmed);
    notifyListeners();
  }

  Future<void> resetToDefault() async {
    final resolved = await AppConfig.resolveBaseApiUrl();
    if (resolved.isEmpty) {
      _baseUrl = '';
      await _prefs.remove(_baseUrlKey);
      notifyListeners();
      return;
    }
    await setBaseUrl(resolved);
  }
}
