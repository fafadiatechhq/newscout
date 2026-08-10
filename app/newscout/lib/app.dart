import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'config/app_config.dart';
import 'config/app_theme.dart';
import 'core/models/article.dart';
import 'core/providers/theme_provider.dart';
import 'features/article/article_detail_loader.dart';
import 'features/article/article_detail_screen.dart';
import 'features/bookmarks/bookmarks_screen.dart';
import 'features/categories/categories_screen.dart';
import 'features/categories/category_articles_screen.dart';
import 'features/home/home_screen.dart';
import 'features/profile/appearance_screen.dart';
import 'features/profile/login_screen.dart';
import 'features/profile/profile_screen.dart';
import 'features/search/search_screen.dart';
import 'features/splash/splash_screen.dart';
import 'features/trending/trending_screen.dart';
import 'navigation/app_shell.dart';

class NewScoutApp extends StatelessWidget {
  NewScoutApp({super.key});

  final _router = GoRouter(
    initialLocation: '/',
    routes: [
      // Splash — shown once on cold start, then navigates to /home
      GoRoute(
        path: '/',
        builder: (context, state) => const SplashScreen(),
      ),
      // Article detail is outside the shell so the bottom nav is hidden.
      GoRoute(
        path: '/article/:id',
        builder: (context, state) {
          final extra = state.extra;
          if (extra is Article) {
            return ArticleDetailScreen(article: extra);
          }
          return ArticleDetailLoader(
            articleId: state.pathParameters['id']!,
          );
        },
      ),
      // Legacy bookmarks tab URL → Profile nested route
      GoRoute(
        path: '/bookmarks',
        redirect: (context, state) => '/profile/bookmarks',
      ),
      ShellRoute(
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: '/home',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: HomeScreen(),
            ),
          ),
          GoRoute(
            path: '/categories',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: CategoriesScreen(),
            ),
            routes: [
              GoRoute(
                path: ':id',
                builder: (context, state) => CategoryArticlesScreen(
                  categoryId: state.pathParameters['id']!,
                ),
              ),
            ],
          ),
          GoRoute(
            path: '/trending',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: TrendingScreen(),
            ),
          ),
          GoRoute(
            path: '/search',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: SearchScreen(),
            ),
          ),
          GoRoute(
            path: '/profile',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: ProfileScreen(),
            ),
            routes: [
              GoRoute(
                path: 'login',
                builder: (context, state) => const LoginScreen(),
              ),
              GoRoute(
                path: 'bookmarks',
                builder: (context, state) => const BookmarksScreen(),
              ),
              GoRoute(
                path: 'appearance',
                builder: (context, state) => const AppearanceScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  );

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();

    return MaterialApp.router(
      title: AppConfig.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: themeProvider.mode,
      routerConfig: _router,
    );
  }
}
