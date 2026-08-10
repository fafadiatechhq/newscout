import 'dart:io';

import 'package:device_info_plus/device_info_plus.dart';

bool get isAndroidPlatform => Platform.isAndroid;

Future<bool> isAndroidEmulator() async {
  final android = await DeviceInfoPlugin().androidInfo;
  return !android.isPhysicalDevice;
}
