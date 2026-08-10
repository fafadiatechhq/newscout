import django_filters

from core.models import Article


class ArticleFilter(django_filters.FilterSet):
    """Query filters for the articles list endpoint."""

    category = django_filters.NumberFilter(field_name="category_id")
    category_id = django_filters.NumberFilter(field_name="category_id")
    source = django_filters.NumberFilter(field_name="source")
    source_id = django_filters.NumberFilter(field_name="source")
    is_breaking = django_filters.BooleanFilter()
    trending = django_filters.BooleanFilter()
    featured = django_filters.BooleanFilter()
    editors_pick = django_filters.BooleanFilter()

    class Meta:
        model = Article
        fields = [
            "category",
            "category_id",
            "source",
            "source_id",
            "is_breaking",
            "trending",
            "featured",
            "editors_pick",
        ]
