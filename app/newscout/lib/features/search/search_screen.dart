import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/app_config.dart';
import '../../core/providers/news_provider.dart';
import '../../shared/widgets/article_list_tile.dart';
import '../../shared/widgets/shimmer_loading.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _controller = TextEditingController();
  bool _hasSearched = false;

  @override
  void initState() {
    super.initState();
    _controller.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submit() {
    final query = _controller.text.trim();
    if (query.isEmpty) return;
    setState(() => _hasSearched = true);
    context.read<NewsProvider>().search(query);
  }

  void _clear() {
    _controller.clear();
    setState(() => _hasSearched = false);
    context.read<NewsProvider>().clearSearch();
  }

  @override
  Widget build(BuildContext context) {
    final news = context.watch<NewsProvider>();
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: AppConfig.surfaceColor,
      appBar: AppBar(
        backgroundColor: Colors.white,
        automaticallyImplyLeading: false,
        title: const Text('Search'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 10),
                child: TextField(
                  controller: _controller,
                  autofocus: true,
                  onSubmitted: (_) => _submit(),
                  textInputAction: TextInputAction.search,
                  decoration: InputDecoration(
                    hintText: 'Search news, topics, sources…',
                    hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 15),
                    prefixIcon: const Icon(Icons.search, color: AppConfig.primaryColor),
                    suffixIcon: _controller.text.isNotEmpty
                        ? Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: Icon(Icons.close, color: Colors.grey.shade400),
                                onPressed: _clear,
                              ),
                              GestureDetector(
                                onTap: _submit,
                                child: Container(
                                  margin: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: AppConfig.primaryColor,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Text(
                                    'Search',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w600,
                                      fontSize: 13,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          )
                        : null,
                    filled: true,
                    fillColor: AppConfig.surfaceColor,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 0),
                  ),
                ),
              ),
              Divider(height: 1, color: Colors.grey.shade200),
            ],
          ),
        ),
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 200),
        child: _buildBody(news, theme),
      ),
    );
  }

  Widget _buildBody(NewsProvider news, ThemeData theme) {
    if (_controller.text.isEmpty) {
      return _SearchEmptyState(key: const ValueKey('empty'));
    }

    if (!_hasSearched) {
      return _SearchPrompt(key: const ValueKey('prompt'));
    }

    if (news.isSearching) {
      return ListView.builder(
        key: const ValueKey('loading'),
        itemCount: 5,
        itemBuilder: (_, _) => const ArticleTileShimmer(),
      );
    }

    if (news.searchResults.isEmpty) {
      return _NoResults(
        key: const ValueKey('no-results'),
        query: _controller.text,
      );
    }

    return ListView.builder(
      key: const ValueKey('results'),
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: news.searchResults.length,
      itemBuilder: (context, index) {
        return ArticleListTile(article: news.searchResults[index]);
      },
    );
  }
}

class _SearchEmptyState extends StatelessWidget {
  const _SearchEmptyState({super.key});

  static const _suggestions = [
    'Artificial Intelligence',
    'Climate Change',
    'Stock Market',
    'Cricket',
    'Space Exploration',
    'Start-ups',
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 12),
          Text(
            'Popular topics',
            style: theme.textTheme.titleSmall?.copyWith(
              fontWeight: FontWeight.w700,
              color: Colors.grey.shade500,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _suggestions.map((s) {
              return ActionChip(
                label: Text(s),
                onPressed: () {
                  // No direct TextField access here; handled via parent
                },
                backgroundColor:
                    AppConfig.primaryColor.withAlpha(15),
                labelStyle: const TextStyle(
                  color: AppConfig.primaryColor,
                  fontWeight: FontWeight.w600,
                ),
                side: BorderSide.none,
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

class _SearchPrompt extends StatelessWidget {
  const _SearchPrompt({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.touch_app_rounded, size: 64, color: Colors.grey.shade300),
            const SizedBox(height: 16),
            const Text(
              'Tap Search to find articles',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Press the Search button or the\nSearch key on your keyboard.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600, height: 1.5),
            ),
          ],
        ),
      ),
    );
  }
}

class _NoResults extends StatelessWidget {
  final String query;

  const _NoResults({super.key, required this.query});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.search_off_rounded,
                size: 64, color: Colors.grey.shade300),
            const SizedBox(height: 16),
            Text(
              'No results for "$query"',
              style: const TextStyle(
                  fontSize: 16, fontWeight: FontWeight.w600),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Try different keywords or check\nyour spelling.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600, height: 1.5),
            ),
          ],
        ),
      ),
    );
  }
}
