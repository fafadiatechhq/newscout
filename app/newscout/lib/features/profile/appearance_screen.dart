import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/providers/theme_provider.dart';

class AppearanceScreen extends StatelessWidget {
  const AppearanceScreen({super.key});

  static const _options = [
    _ThemeOption(
      mode: ThemeMode.light,
      icon: Icons.light_mode_outlined,
      title: 'Light',
      subtitle: 'Always use light theme',
    ),
    _ThemeOption(
      mode: ThemeMode.dark,
      icon: Icons.dark_mode_outlined,
      title: 'Dark',
      subtitle: 'Always use dark theme',
    ),
    _ThemeOption(
      mode: ThemeMode.system,
      icon: Icons.phone_android_outlined,
      title: 'System',
      subtitle: 'Match device setting',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Appearance'),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemCount: _options.length,
        separatorBuilder: (_, _) => Divider(
          indent: 72,
          height: 1,
          color: theme.dividerColor,
        ),
        itemBuilder: (context, index) {
          final option = _options[index];
          final selected = themeProvider.mode == option.mode;

          return ListTile(
            leading: Icon(
              option.icon,
              color: selected
                  ? theme.colorScheme.primary
                  : theme.colorScheme.onSurfaceVariant,
            ),
            title: Text(
              option.title,
              style: TextStyle(
                fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
                color: selected
                    ? theme.colorScheme.primary
                    : theme.colorScheme.onSurface,
              ),
            ),
            subtitle: Text(
              option.subtitle,
              style: TextStyle(
                color: theme.colorScheme.onSurfaceVariant,
                fontSize: 13,
              ),
            ),
            trailing: selected
                ? Icon(Icons.check_circle, color: theme.colorScheme.primary)
                : Icon(
                    Icons.circle_outlined,
                    color: theme.colorScheme.onSurfaceVariant.withAlpha(100),
                  ),
            onTap: () => themeProvider.setMode(option.mode),
          );
        },
      ),
    );
  }
}

class _ThemeOption {
  final ThemeMode mode;
  final IconData icon;
  final String title;
  final String subtitle;

  const _ThemeOption({
    required this.mode,
    required this.icon,
    required this.title,
    required this.subtitle,
  });
}
