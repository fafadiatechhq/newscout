import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../config/app_config.dart';
import '../core/providers/config_provider.dart';

/// Shows the server URL setup dialog.
/// Returns `true` when a URL was saved, `false` when dismissed without saving.
Future<bool> showServerUrlDialog(
  BuildContext context, {
  bool required = false,
}) async {
  final config = context.read<ConfigProvider>();
  final controller = TextEditingController(text: config.baseUrl);
  var saved = false;

  await showDialog<void>(
    context: context,
    barrierDismissible: !required,
    builder: (ctx) => PopScope(
      canPop: !required,
      child: AlertDialog(
        title: const Text('Server URL'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              required
                  ? 'Enter your computer\'s LAN IP so the app can reach the local Docker API.'
                  : 'API base URL used for all requests.\nChanges take effect immediately.',
              style: const TextStyle(fontSize: 13, color: Colors.black54),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: controller,
              autocorrect: false,
              keyboardType: TextInputType.url,
              decoration: InputDecoration(
                labelText: 'Base URL',
                hintText: AppConfig.serverUrlHint,
                border: const OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          if (!required)
            TextButton(
              onPressed: () async {
                await context.read<ConfigProvider>().resetToDefault();
                if (ctx.mounted) Navigator.pop(ctx);
              },
              child: const Text('Reset'),
            ),
          if (!required)
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel'),
            ),
          FilledButton(
            onPressed: () async {
              final url = controller.text.trim();
              if (url.isEmpty) return;
              await context.read<ConfigProvider>().setBaseUrl(url);
              saved = true;
              if (ctx.mounted) Navigator.pop(ctx);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    ),
  );

  controller.dispose();
  return saved;
}
