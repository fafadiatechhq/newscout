import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../config/app_config.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/providers/news_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return auth.isLoggedIn
        ? _LoggedInProfile(auth: auth)
        : const _AnonymousProfile();
  }
}

// ── Anonymous (not logged in) ──────────────────────────────────────────────────

class _AnonymousProfile extends StatelessWidget {
  const _AnonymousProfile();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConfig.surfaceColor,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text(
          'Profile',
          style: TextStyle(
              color: AppConfig.primaryColor, fontWeight: FontWeight.w800),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const SizedBox(height: 24),
            CircleAvatar(
              radius: 44,
              backgroundColor: AppConfig.primaryColor.withAlpha(25),
              child: const Icon(
                Icons.person_outline,
                size: 44,
                color: AppConfig.primaryColor,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'You\'re browsing anonymously',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 8),
            Text(
              'Sign in to personalise your feed,\nsync bookmarks, and more.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600, height: 1.5),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () => context.go('/profile/login'),
                child: const Text('Sign In'),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () => context.go('/profile/login'),
                child: const Text('Create Account'),
              ),
            ),
            const SizedBox(height: 40),
            const Divider(),
            const SizedBox(height: 16),
            _SettingsTile(
              icon: Icons.bookmark_outline,
              title: 'Bookmarks',
              onTap: () => context.push('/profile/bookmarks'),
            ),
            _SettingsTile(
              icon: Icons.notifications_outlined,
              title: 'Notifications',
              onTap: () {},
            ),
            _SettingsTile(
              icon: Icons.info_outline,
              title: 'About ${AppConfig.appName}',
              onTap: () => _showAbout(context),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Logged-in profile ─────────────────────────────────────────────────────────

class _LoggedInProfile extends StatelessWidget {
  final AuthProvider auth;

  const _LoggedInProfile({required this.auth});

  @override
  Widget build(BuildContext context) {
    final user = auth.currentUser!;
    final news = context.watch<NewsProvider>();

    return Scaffold(
      backgroundColor: AppConfig.surfaceColor,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text(
          'Profile',
          style: TextStyle(
              color: AppConfig.primaryColor, fontWeight: FontWeight.w800),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // ── User header ──────────────────────────────────────────────
            Container(
              color: Colors.white,
              padding: const EdgeInsets.all(24),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 32,
                    backgroundColor: AppConfig.primaryColor,
                    child: Text(
                      user.name[0].toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user.name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          user.email,
                          style: TextStyle(
                              color: Colors.grey.shade600, fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // ── Preferred categories ─────────────────────────────────────
            if (news.categories.isNotEmpty)
              Container(
                color: Colors.white,
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Your Interests',
                      style: TextStyle(
                          fontWeight: FontWeight.w700, fontSize: 15),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: news.categories.map((cat) {
                        final isSelected = user.preferredCategoryIds
                            .contains(cat.id);
                        return FilterChip(
                          label: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(cat.icon, size: 14,
                                  color: isSelected
                                      ? AppConfig.primaryColor
                                      : Colors.grey.shade600),
                              const SizedBox(width: 4),
                              Text(cat.name),
                            ],
                          ),
                          selected: isSelected,
                          onSelected: (_) {},
                          selectedColor: AppConfig.primaryColor.withAlpha(30),
                          checkmarkColor: AppConfig.primaryColor,
                          labelStyle: TextStyle(
                            color: isSelected
                                ? AppConfig.primaryColor
                                : Colors.grey.shade700,
                            fontWeight: isSelected
                                ? FontWeight.w600
                                : FontWeight.normal,
                            fontSize: 13,
                          ),
                          side: isSelected
                              ? const BorderSide(
                                  color: AppConfig.primaryColor, width: 1.5)
                              : BorderSide(color: Colors.grey.shade200),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),

            const SizedBox(height: 12),

            // ── Settings ─────────────────────────────────────────────────
            Container(
              color: Colors.white,
              child: Column(
                children: [
                  _SettingsTile(
                    icon: Icons.bookmark_outline,
                    title: 'Bookmarks',
                    onTap: () => context.push('/profile/bookmarks'),
                  ),
                  const Divider(indent: 56, height: 1),
                  _SettingsTile(
                    icon: Icons.notifications_outlined,
                    title: 'Notifications',
                    onTap: () {},
                  ),
                  const Divider(indent: 56, height: 1),
                  _SettingsTile(
                    icon: Icons.info_outline,
                    title: 'About ${AppConfig.appName}',
                    onTap: () => _showAbout(context),
                  ),
                  const Divider(indent: 56, height: 1),
                  _SettingsTile(
                    icon: Icons.logout,
                    title: 'Sign Out',
                    titleColor: Colors.red.shade600,
                    iconColor: Colors.red.shade400,
                    onTap: () => _confirmLogout(context),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Future<void> _confirmLogout(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Sign out?'),
        content: const Text('You will return to anonymous browsing.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Sign Out',
                style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
    if (confirmed == true && context.mounted) {
      await context.read<AuthProvider>().logout();
    }
  }
}

// ── Shared widgets ─────────────────────────────────────────────────────────────

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color? titleColor;
  final Color? iconColor;
  final VoidCallback onTap;

  const _SettingsTile({
    required this.icon,
    required this.title,
    required this.onTap,
    this.titleColor,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: Icon(icon,
          color: iconColor ?? Colors.grey.shade600, size: 22),
      title: Text(
        title,
        style: TextStyle(
          color: titleColor ?? Colors.black87,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing:
          Icon(Icons.chevron_right, color: Colors.grey.shade400, size: 20),
    );
  }
}

void _showAbout(BuildContext context) {
  showAboutDialog(
    context: context,
    applicationName: AppConfig.appName,
    applicationVersion: '1.0.0',
    applicationLegalese: '© 2025 ${AppConfig.appName}',
    children: [
      const SizedBox(height: 12),
      const Text(AppConfig.appTagline),
    ],
  );
}
