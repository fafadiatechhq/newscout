import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../config/app_config.dart';
import '../../core/models/category.dart';
import '../../core/providers/news_provider.dart';

class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({super.key});

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  String? _selectedId;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final news = context.read<NewsProvider>();
      if (news.categories.isEmpty) news.loadCategories();
    });
  }

  void _onCategoryTap(String id) {
    setState(() => _selectedId = id);
    context.go('/categories/$id');
  }

  @override
  Widget build(BuildContext context) {
    final news = context.watch<NewsProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Categories'),
      ),
      body: news.isLoadingCategories
          ? const Center(
              child: CircularProgressIndicator(color: AppConfig.primaryColor),
            )
          : GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.0,
              ),
              itemCount: news.categories.length,
              itemBuilder: (context, index) {
                final cat = news.categories[index];
                return _CategoryCard(
                  category: cat,
                  isSelected: _selectedId == cat.id,
                  onTap: () => _onCategoryTap(cat.id),
                );
              },
            ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final NewsCategory category;
  final bool isSelected;
  final VoidCallback onTap;

  // Matches the blue selection border shown in the reference design.
  static const _selectedBorderColor = Color(0xFF4A90D9);

  const _CategoryCard({
    required this.category,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: category.color,
          borderRadius: BorderRadius.circular(16),
          border: isSelected
              ? Border.all(color: _selectedBorderColor, width: 2.5)
              : null,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(isSelected ? 30 : 18),
              blurRadius: isSelected ? 12 : 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(category.icon, color: Colors.white, size: 44),
            const SizedBox(height: 12),
            Text(
              category.name,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
