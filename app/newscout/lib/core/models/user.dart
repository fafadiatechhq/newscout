class AppUser {
  final String id;
  final String name;
  final String email;
  final List<String> preferredCategoryIds;

  const AppUser({
    required this.id,
    required this.name,
    required this.email,
    this.preferredCategoryIds = const [],
  });

  AppUser copyWith({
    String? name,
    String? email,
    List<String>? preferredCategoryIds,
  }) {
    return AppUser(
      id: id,
      name: name ?? this.name,
      email: email ?? this.email,
      preferredCategoryIds: preferredCategoryIds ?? this.preferredCategoryIds,
    );
  }

  factory AppUser.fromJson(Map<String, dynamic> json) {
    return AppUser(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      preferredCategoryIds: (json['preferredCategoryIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'preferredCategoryIds': preferredCategoryIds,
    };
  }
}
