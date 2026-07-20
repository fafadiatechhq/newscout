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
