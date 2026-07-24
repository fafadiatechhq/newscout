class ArticleSource {
  final String name;
  final String url;

  const ArticleSource({required this.name, required this.url});

  factory ArticleSource.fromJson(Map<String, dynamic> json) => ArticleSource(
        name: json['name'] as String,
        url: json['url'] as String,
      );

  Map<String, dynamic> toJson() => {'name': name, 'url': url};
}

class Article {
  final String id;
  final String title;
  final String summary;
  final String imageUrl;
  final String source;
  final String url;
  final String categoryId;
  final DateTime publishedAt;
  final bool isBreaking;
  final int readTimeMinutes;
  final List<ArticleSource> clusterSources;

  const Article({
    required this.id,
    required this.title,
    required this.summary,
    required this.imageUrl,
    required this.source,
    required this.url,
    required this.categoryId,
    required this.publishedAt,
    this.isBreaking = false,
    this.readTimeMinutes = 3,
    this.clusterSources = const [],
  });

  factory Article.fromJson(Map<String, dynamic> json) {
    return Article(
      id: json['id'] as String,
      title: json['title'] as String,
      summary: json['summary'] as String,
      imageUrl: json['imageUrl'] as String,
      source: json['source'] as String,
      url: json['url'] as String,
      categoryId: json['categoryId'] as String,
      publishedAt: DateTime.parse(json['publishedAt'] as String),
      isBreaking: json['isBreaking'] as bool? ?? false,
      readTimeMinutes: json['readTimeMinutes'] as int? ?? 3,
      clusterSources: (json['clusterSources'] as List<dynamic>? ?? [])
          .map((e) => ArticleSource.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Maps a Django `/api/v1/articles/` payload (snake_case + nested relations).
  factory Article.fromApiJson(Map<String, dynamic> json) {
    final sources = (json['source'] as List<dynamic>? ?? [])
        .whereType<Map<String, dynamic>>()
        .toList();
    final primary = sources.isNotEmpty ? sources.first : null;
    final category = json['category'];
    final categoryId = category is Map
        ? '${category['id']}'
        : '${json['category_id'] ?? ''}';

    final summary = (json['summary'] as String?) ?? '';
    final wordCount = summary.split(RegExp(r'\s+')).where((w) => w.isNotEmpty).length;
    final readMinutes = wordCount == 0 ? 3 : (wordCount / 200).ceil().clamp(1, 30);

    DateTime publishedAt;
    final rawPublished = json['published_at'];
    if (rawPublished is String && rawPublished.isNotEmpty) {
      publishedAt = DateTime.tryParse(rawPublished) ?? DateTime.now();
    } else {
      publishedAt = DateTime.now();
    }

    return Article(
      id: '${json['id']}',
      title: (json['title'] as String?) ?? '',
      summary: summary,
      imageUrl: (json['image_url'] as String?) ?? '',
      source: (primary?['name'] as String?) ?? 'Unknown',
      url: (json['content_url'] as String?) ?? (primary?['url'] as String?) ?? '',
      categoryId: categoryId,
      publishedAt: publishedAt,
      isBreaking: json['is_breaking'] as bool? ?? false,
      readTimeMinutes: readMinutes,
      clusterSources: sources
          .map(
            (s) => ArticleSource(
              name: (s['name'] as String?) ?? '',
              url: (s['url'] as String?) ?? '',
            ),
          )
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'summary': summary,
      'imageUrl': imageUrl,
      'source': source,
      'url': url,
      'categoryId': categoryId,
      'publishedAt': publishedAt.toIso8601String(),
      'isBreaking': isBreaking,
      'readTimeMinutes': readTimeMinutes,
      'clusterSources': clusterSources.map((s) => s.toJson()).toList(),
    };
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) || (other is Article && other.id == id);

  @override
  int get hashCode => id.hashCode;
}
