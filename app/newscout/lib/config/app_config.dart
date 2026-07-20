import 'package:flutter/material.dart';

/// Single source of truth for white-label configuration.
/// To re-brand the app, only this file needs to change.
class AppConfig {
  // ── Brand identity ──────────────────────────────────────────────────────────
  static const String appName = 'NewScout';
  static const String appTagline = 'Aggregated Quality News';

  // ── Brand colors (from logo) ─────────────────────────────────────────────
  static const Color primaryColor = Color(0xFF2E7D7D);   // deep teal
  static const Color accentColor = Color(0xFFF06B6B);    // coral
  static const Color surfaceColor = Color(0xFFF7F8FA);
  static const Color cardColor = Color(0xFFFFFFFF);

  // ── Typography ───────────────────────────────────────────────────────────
  // Change these two values to retype the entire app for a white-label build.
  // Values must be valid Google Fonts family names (case-sensitive).
  static const String headlineFontFamily = 'DM Serif Display'; // titles, headlines
  static const String bodyFontFamily = 'Inter';                 // body, labels, UI

  // ── API (swap this to point to a real backend) ───────────────────────────
  static const String baseApiUrl = 'https://api.newscout.in/v1';

  // ── Feature flags ────────────────────────────────────────────────────────
  static const bool enablePushNotifications = true;
  static const bool enableOfflineBookmarks = true;
  static const int searchDebounceMs = 350;

  // ── Pagination ───────────────────────────────────────────────────────────
  static const int articlesPerPage = 20;

  AppConfig._();
}
