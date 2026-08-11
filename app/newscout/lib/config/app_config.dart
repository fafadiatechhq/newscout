import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'platform_detector.dart';

/// Single source of truth for white-label configuration.
/// To re-brand the app, only this file needs to change.
class AppConfig {
  // ── Brand identity ──────────────────────────────────────────────────────────
  static const String appName = 'NewScout';
  static const String appTagline = 'Aggregated Quality News';

  // ── Brand colors (from logo) ─────────────────────────────────────────────
  static const Color primaryColor = Color(0xFF2E7D7D); // deep teal
  static const Color accentColor = Color(0xFFF06B6B); // coral
  static const Color surfaceColor = Color(0xFFF7F8FA);
  static const Color cardColor = Color(0xFFFFFFFF);

  // ── Dark mode palette ────────────────────────────────────────────────────
  static const Color surfaceColorDark = Color(0xFF121212);
  static const Color cardColorDark = Color(0xFF1E1E1E);
  static const Color onSurfaceDark = Color(0xFFE8E8E8);
  static const Color mutedTextDark = Color(0xFF9E9E9E);

  // ── Typography ───────────────────────────────────────────────────────────
  // Change these two values to retype the entire app for a white-label build.
  // Values must be valid Google Fonts family names (case-sensitive).
  static const String headlineFontFamily = 'DM Serif Display'; // titles, headlines
  static const String bodyFontFamily = 'Inter'; // body, labels, UI

  // ── API ────────────────────────────────────────────────────────────────────
  // Debug/profile → local Docker. Release → production.
  // Override any build: flutter run --dart-define=API_BASE_URL=http://HOST:8000/api/v1
  static const String productionApiUrl = 'https://api.newscout.in/api/v1';
  static const String androidEmulatorApiUrl = 'http://10.0.2.2:8000/api/v1';
  static const String localApiUrl = 'http://127.0.0.1:8000/api/v1';
  static const String serverUrlHint = 'http://YOUR_LAN_IP:8000/api/v1';

  static const String _productionApiUrl = productionApiUrl;
  static const String _androidEmulatorApiUrl = androidEmulatorApiUrl;
  static const String _localApiUrl = localApiUrl;

  /// Matches the current page hostname on web (same approach as the Next.js client).
  static String devApiUrlForHost(String host) {
    final normalizedHost = host.isNotEmpty ? host : 'localhost';
    return 'http://$normalizedHost:8000/api/v1';
  }

  /// Resolves the API base URL for the current platform and build mode.
  /// Returns an empty string on a physical Android device when no override is set.
  static Future<String> resolveBaseApiUrl() async {
    const fromEnv = String.fromEnvironment('API_BASE_URL');
    if (fromEnv.isNotEmpty) return fromEnv;
    if (kReleaseMode) return _productionApiUrl;
    if (kIsWeb) return devApiUrlForHost(Uri.base.host);
    if (isAndroidPlatform) {
      if (await isAndroidEmulator()) return _androidEmulatorApiUrl;
      return '';
    }
    return _localApiUrl;
  }

  static String get baseApiUrl {
    const fromEnv = String.fromEnvironment('API_BASE_URL');
    if (fromEnv.isNotEmpty) return fromEnv;
    if (kReleaseMode) return _productionApiUrl;
    if (kIsWeb) return devApiUrlForHost(Uri.base.host);
    if (isAndroidPlatform) return _androidEmulatorApiUrl;
    return _localApiUrl;
  }

  // ── Feature flags ────────────────────────────────────────────────────────
  static const bool enablePushNotifications = true;
  static const bool enableOfflineBookmarks = true;
  static const int searchDebounceMs = 350;

  // ── Pagination ───────────────────────────────────────────────────────────
  static const int articlesPerPage = 20;

  AppConfig._();
}
