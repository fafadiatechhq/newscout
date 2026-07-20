import 'package:flutter_test/flutter_test.dart';
import 'package:newscout/config/app_config.dart';

void main() {
  test('AppConfig has correct brand values', () {
    expect(AppConfig.appName, 'NewScout');
    expect(AppConfig.appTagline, isNotEmpty);
  });
}
