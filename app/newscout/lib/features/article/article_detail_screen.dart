import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:timeago/timeago.dart' as timeago;
import 'package:url_launcher/url_launcher.dart';

import '../../config/app_config.dart';
import '../../config/app_theme.dart';
import '../../core/models/article.dart';
import '../../core/providers/bookmarks_provider.dart';
import '../../core/providers/news_provider.dart';

// ── Outer shell: PageView that enables left/right article swiping ──────────────

class ArticleDetailScreen extends StatefulWidget {
  final Article article;

  const ArticleDetailScreen({super.key, required this.article});

  @override
  State<ArticleDetailScreen> createState() => _ArticleDetailScreenState();
}

class _ArticleDetailScreenState extends State<ArticleDetailScreen> {
  late final PageController _pageController;

  // True once we have scrolled to the correct initial page.
  bool _jumped = false;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();

    // Trigger load if category articles haven't been fetched yet.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final news = context.read<NewsProvider>();
      if (news.categoryArticles(widget.article.categoryId).isEmpty) {
        news.loadCategoryArticles(widget.article.categoryId);
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _maybeJump(List<Article> articles) {
    if (_jumped) return;
    final idx = articles.indexWhere((a) => a.id == widget.article.id);
    if (idx > 0) {
      // Use addPostFrameCallback so the PageView is fully laid out first.
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted && _pageController.hasClients) {
          _pageController.jumpToPage(idx);
        }
      });
    }
    _jumped = true;
  }

  @override
  Widget build(BuildContext context) {
    final news = context.watch<NewsProvider>();
    final categoryArticles = news.categoryArticles(widget.article.categoryId);

    // Fall back to a single-article list until the category loads.
    final articles =
        categoryArticles.isEmpty ? [widget.article] : categoryArticles;

    // As soon as the real list is available, scroll to the correct page once.
    if (categoryArticles.isNotEmpty) _maybeJump(articles);

    return PageView.builder(
      controller: _pageController,
      itemCount: articles.length,
      itemBuilder: (_, i) => _ArticlePage(
        article: articles[i],
        pageIndex: i,
        total: articles.length,
      ),
    );
  }
}

// ── Per-article page ───────────────────────────────────────────────────────────

class _ArticlePage extends StatefulWidget {
  final Article article;
  final int pageIndex;
  final int total;

  const _ArticlePage({
    required this.article,
    required this.pageIndex,
    required this.total,
  });

  @override
  State<_ArticlePage> createState() => _ArticlePageState();
}

class _ArticlePageState extends State<_ArticlePage> {
  Future<void> _openInBrowser() async {
    final uri = Uri.tryParse(widget.article.url);
    if (uri == null) return;
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  void _showSourcesPopup() {
    showDialog(
      context: context,
      builder: (ctx) => _SourcesDialog(article: widget.article),
    );
  }

  Widget _dot() => Container(
        width: 3,
        height: 3,
        decoration: BoxDecoration(
          color: Colors.grey.shade400,
          shape: BoxShape.circle,
        ),
      );

  @override
  Widget build(BuildContext context) {
    final article = widget.article;
    final news = context.watch<NewsProvider>();
    final bookmarks = context.watch<BookmarksProvider>();
    final category = news.categoryById(article.categoryId);
    final related = news.relatedArticles(article.categoryId, article.id);
    final isBookmarked = bookmarks.isBookmarked(article.id);

    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          // ── Collapsing hero app bar ─────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            backgroundColor: Colors.white,
            foregroundColor: Colors.white,
            leading: Padding(
              padding: const EdgeInsets.all(8),
              child: CircleAvatar(
                backgroundColor: Colors.black45,
                child: IconButton(
                  icon: const Icon(Icons.arrow_back, size: 18),
                  color: Colors.white,
                  onPressed: () => context.pop(),
                ),
              ),
            ),
            actions: [
              // Article position indicator (shown when list has > 1 article)
              if (widget.total > 1)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black45,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${widget.pageIndex + 1} / ${widget.total}',
                      style: AppTheme.body(11, FontWeight.w600,
                          color: Colors.white),
                    ),
                  ),
                ),
              Padding(
                padding: const EdgeInsets.all(8),
                child: CircleAvatar(
                  backgroundColor: Colors.black45,
                  child: IconButton(
                    icon: Icon(
                      isBookmarked
                          ? Icons.bookmark
                          : Icons.bookmark_outline,
                      size: 18,
                    ),
                    color:
                        isBookmarked ? AppConfig.accentColor : Colors.white,
                    onPressed: () => bookmarks.toggleBookmark(article),
                  ),
                ),
              ),
              Padding(
                padding:
                    const EdgeInsets.only(right: 8, top: 8, bottom: 8),
                child: CircleAvatar(
                  backgroundColor: Colors.black45,
                  child: IconButton(
                    icon: const Icon(Icons.open_in_browser, size: 18),
                    color: Colors.white,
                    onPressed: _openInBrowser,
                  ),
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  CachedNetworkImage(
                    imageUrl: article.imageUrl,
                    fit: BoxFit.cover,
                    placeholder: (_, _) =>
                        Container(color: Colors.grey.shade200),
                    errorWidget: (_, _, _) =>
                        Container(color: Colors.grey.shade200),
                  ),
                  const DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Colors.black54],
                        stops: [0.5, 1.0],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Article body ────────────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Category + Breaking badge
                  Row(
                    children: [
                      if (category != null)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: category.color,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(category.icon,
                                  color: Colors.white, size: 12),
                              const SizedBox(width: 4),
                              Text(
                                category.name,
                                style: AppTheme.body(11, FontWeight.w700,
                                    color: Colors.white),
                              ),
                            ],
                          ),
                        ),
                      if (article.isBreaking) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppConfig.accentColor,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'BREAKING',
                            style: AppTheme.body(10, FontWeight.w800,
                                color: Colors.white, letterSpacing: 0.8),
                          ),
                        ),
                      ],
                    ],
                  ),

                  const SizedBox(height: 14),

                  // Title
                  Text(
                    article.title,
                    style: AppTheme.headline(22, FontWeight.w700,
                        color: const Color(0xFF1A1A1A), height: 1.3),
                  ),

                  const SizedBox(height: 14),

                  // Metadata row
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.newspaper_outlined,
                              size: 14, color: AppConfig.primaryColor),
                          const SizedBox(width: 5),
                          Text(
                            article.source,
                            style: AppTheme.body(13, FontWeight.w700,
                                color: AppConfig.primaryColor),
                          ),
                        ],
                      ),
                      if (article.clusterSources.isNotEmpty)
                        _SourcesChip(
                          count: article.clusterSources.length,
                          onTap: _showSourcesPopup,
                        ),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          _dot(),
                          const SizedBox(width: 8),
                          Icon(Icons.access_time,
                              size: 13, color: Colors.grey.shade500),
                          const SizedBox(width: 4),
                          Text(
                            timeago.format(article.publishedAt),
                            style: AppTheme.body(13, FontWeight.w400,
                                color: Colors.grey.shade500),
                          ),
                          const SizedBox(width: 8),
                          _dot(),
                          const SizedBox(width: 8),
                          Text(
                            '${article.readTimeMinutes} min read',
                            style: AppTheme.body(13, FontWeight.w400,
                                color: Colors.grey.shade500),
                          ),
                        ],
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),
                  Divider(color: Colors.grey.shade100),
                  const SizedBox(height: 20),

                  // Body text
                  Text(
                    article.summary,
                    style: AppTheme.body(16, FontWeight.w400,
                        color: const Color(0xFF2C2C2C), height: 1.7),
                  ),

                  const SizedBox(height: 28),

                  // Swipe hint (shown when there are neighbours to swipe to)
                  if (widget.total > 1)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.swipe_rounded,
                              size: 14, color: Colors.grey.shade400),
                          const SizedBox(width: 6),
                          Text(
                            'Swipe to read more articles',
                            style: AppTheme.body(12, FontWeight.w400,
                                color: Colors.grey.shade400),
                          ),
                        ],
                      ),
                    ),

                  // Read Full Article CTA
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton.icon(
                      onPressed: _openInBrowser,
                      icon: const Icon(Icons.open_in_new, size: 16),
                      label: const Text('Read Full Article'),
                      style: FilledButton.styleFrom(
                        padding:
                            const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),

                  const SizedBox(height: 36),
                ],
              ),
            ),
          ),

          // ── Related Articles carousel ───────────────────────────────────────
          if (related.isNotEmpty) ...[
            SliverToBoxAdapter(
              child: _RelatedHeader(
                  categoryName: category?.name ?? 'More'),
            ),
            SliverToBoxAdapter(
              child: _RelatedArticlesCarousel(articles: related),
            ),
          ],

          const SliverToBoxAdapter(child: SizedBox(height: 32)),
        ],
      ),
    );
  }
}

// ── Related Articles header ────────────────────────────────────────────────────

class _RelatedHeader extends StatelessWidget {
  final String categoryName;

  const _RelatedHeader({required this.categoryName});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppConfig.surfaceColor,
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
      child: Row(
        children: [
          Container(
            width: 3,
            height: 18,
            decoration: BoxDecoration(
              color: AppConfig.accentColor,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            'More from $categoryName',
            style: AppTheme.headline(16, FontWeight.w700,
                color: const Color(0xFF1A1A1A)),
          ),
        ],
      ),
    );
  }
}

// ── Related Articles carousel ──────────────────────────────────────────────────

class _RelatedArticlesCarousel extends StatefulWidget {
  final List<Article> articles;

  const _RelatedArticlesCarousel({required this.articles});

  @override
  State<_RelatedArticlesCarousel> createState() =>
      _RelatedArticlesCarouselState();
}

class _RelatedArticlesCarouselState
    extends State<_RelatedArticlesCarousel> {
  late final PageController _controller;
  int _current = 0;

  @override
  void initState() {
    super.initState();
    _controller = PageController(viewportFraction: 0.88);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppConfig.surfaceColor,
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        children: [
          SizedBox(
            height: 210,
            child: PageView.builder(
              controller: _controller,
              itemCount: widget.articles.length,
              onPageChanged: (i) => setState(() => _current = i),
              itemBuilder: (context, index) {
                return _RelatedCard(article: widget.articles[index]);
              },
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(widget.articles.length, (i) {
              return AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.symmetric(horizontal: 3),
                width: _current == i ? 18 : 6,
                height: 6,
                decoration: BoxDecoration(
                  color: _current == i
                      ? AppConfig.primaryColor
                      : Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(3),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}

// ── Sources chip button ────────────────────────────────────────────────────────

class _SourcesChip extends StatelessWidget {
  final int count;
  final VoidCallback onTap;

  const _SourcesChip({required this.count, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding:
            const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.layers_outlined,
                size: 14, color: Color(0xFF1A1A1A)),
            const SizedBox(width: 5),
            Text(
              '$count Sources',
              style: AppTheme.body(12, FontWeight.w600,
                  color: const Color(0xFF1A1A1A)),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Sources popup dialog ───────────────────────────────────────────────────────

class _SourcesDialog extends StatelessWidget {
  final Article article;

  const _SourcesDialog({required this.article});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape:
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      insetPadding:
          const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.75,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 24, 16, 0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Published on ${article.clusterSources.length} sources',
                          style: AppTheme.headline(20, FontWeight.w700,
                              color: const Color(0xFF1A1A1A)),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          article.title,
                          style: AppTheme.body(13, FontWeight.w400,
                              color: Colors.grey.shade500, height: 1.4),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        border:
                            Border.all(color: Colors.grey.shade300),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.close,
                          size: 18, color: Color(0xFF1A1A1A)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Flexible(
              child: SingleChildScrollView(
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      for (int i = 0;
                          i < article.clusterSources.length;
                          i++) ...[
                        if (i > 0)
                          Divider(
                              height: 1, color: Colors.grey.shade200),
                        _SourceTile(source: article.clusterSources[i]),
                      ],
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}

class _SourceTile extends StatelessWidget {
  final ArticleSource source;

  const _SourceTile({required this.source});

  Future<void> _open() async {
    final uri = Uri.tryParse(source.url);
    if (uri == null) return;
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: const Color(0xFF2E5D5D),
            child: Text(
              source.name[0].toUpperCase(),
              style: AppTheme.body(16, FontWeight.w700,
                  color: Colors.white),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      source.name,
                      style: AppTheme.body(15, FontWeight.w700,
                          color: const Color(0xFF1A1A1A)),
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.verified,
                        size: 15, color: Color(0xFF2E5D5D)),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  'Verified Publisher',
                  style: AppTheme.body(12, FontWeight.w400,
                      color: Colors.grey.shade500),
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: _open,
            child: Icon(Icons.open_in_new,
                size: 20, color: Colors.grey.shade500),
          ),
        ],
      ),
    );
  }
}

// ── Related article card ───────────────────────────────────────────────────────

class _RelatedCard extends StatelessWidget {
  final Article article;

  const _RelatedCard({required this.article});

  @override
  Widget build(BuildContext context) {
    final bookmarks = context.watch<BookmarksProvider>();
    final isBookmarked = bookmarks.isBookmarked(article.id);

    return GestureDetector(
      onTap: () => context.push('/article/${article.id}', extra: article),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 6),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(20),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Stack(
            fit: StackFit.expand,
            children: [
              CachedNetworkImage(
                imageUrl: article.imageUrl,
                fit: BoxFit.cover,
                placeholder: (_, _) =>
                    Container(color: Colors.grey.shade300),
                errorWidget: (_, _, _) =>
                    Container(color: Colors.grey.shade300),
              ),
              const DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.transparent, Colors.black87],
                    stops: [0.35, 1.0],
                  ),
                ),
              ),
              Positioned(
                top: 10,
                right: 10,
                child: GestureDetector(
                  onTap: () => bookmarks.toggleBookmark(article),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: const BoxDecoration(
                      color: Colors.black45,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      isBookmarked
                          ? Icons.bookmark
                          : Icons.bookmark_outline,
                      size: 16,
                      color: isBookmarked
                          ? AppConfig.accentColor
                          : Colors.white,
                    ),
                  ),
                ),
              ),
              Positioned(
                left: 14,
                right: 14,
                bottom: 14,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      article.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppTheme.headline(14, FontWeight.w700,
                          color: Colors.white, height: 1.3),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${article.source} · ${timeago.format(article.publishedAt)}',
                      style: AppTheme.body(11, FontWeight.w400,
                          color: Colors.white.withAlpha(190)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
