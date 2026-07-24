import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'app.dart';
import 'core/providers/auth_provider.dart';
import 'core/providers/bookmarks_provider.dart';
import 'core/providers/news_provider.dart';
import 'core/services/api_auth_service.dart';
import 'core/services/api_client.dart';
import 'core/services/api_news_service.dart';
import 'core/services/auth_service.dart';
import 'core/services/news_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final prefs = await SharedPreferences.getInstance();
  final apiClient = ApiClient(prefs);

  // ── Service layer ──────────────────────────────────────────────────────────
  final NewsService newsService = ApiNewsService(apiClient);
  final AuthService authService = ApiAuthService(apiClient);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => NewsProvider(newsService),
        ),
        ChangeNotifierProvider(
          create: (_) => AuthProvider(authService)..checkAuthState(),
        ),
        ChangeNotifierProvider(
          create: (_) => BookmarksProvider(prefs),
        ),
      ],
      child: NewScoutApp(),
    ),
  );
}
