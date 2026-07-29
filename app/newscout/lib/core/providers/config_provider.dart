import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Stores runtime-configurable app settings, persisted across launches.
/// The base API URL can be changed while the app is running — ApiClient
/// reads from this provider on every request, so changes take effect immediately.
class ConfigProvider extends ChangeNotifier {
  static const _baseUrlKey = 'ns_config_base_url';
  static const defaultBaseUrl = 'http://192.168.1.46:8000/api/v1';

  ConfigProvider(this._prefs) {
    _baseUrl = _prefs.getString(_baseUrlKey) ?? defaultBaseUrl;
  }

  final SharedPreferences _prefs;
  late String _baseUrl;

  String get baseUrl => _baseUrl;

  Future<void> setBaseUrl(String url) async {
    final trimmed = url.trim().replaceAll(RegExp(r'/$'), '');
    if (trimmed == _baseUrl) return;
    _baseUrl = trimmed;
    await _prefs.setString(_baseUrlKey, trimmed);
    notifyListeners();
  }

  Future<void> resetToDefault() async {
    await setBaseUrl(defaultBaseUrl);
  }
}
