import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'app.dart';
import 'core/providers/auth_provider.dart';
import 'core/providers/bookmarks_provider.dart';
import 'core/providers/news_provider.dart';
import 'core/services/auth_service.dart';
import 'core/services/mock_news_service.dart';
import 'core/services/news_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final prefs = await SharedPreferences.getInstance();

  // ── Service layer ──────────────────────────────────────────────────────────
  // Swap MockNewsService → ApiNewsService when the backend is ready.
  final NewsService newsService = MockNewsService();
  final AuthService authService = MockAuthService();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => NewsProvider(newsService),
        ),
        ChangeNotifierProvider(
          create: (_) => AuthProvider(authService),
        ),
        ChangeNotifierProvider(
          create: (_) => BookmarksProvider(prefs),
        ),
      ],
      child: NewScoutApp(),
    ),
  );
}
