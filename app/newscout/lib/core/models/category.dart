import 'package:flutter/material.dart';

/// Renamed from Category to avoid conflict with Flutter's @Category annotation.
class NewsCategory {
  final String id;
  final String name;
  final IconData icon;
  final Color color;

  const NewsCategory({
    required this.id,
    required this.name,
    required this.icon,
    required this.color,
  });
}
