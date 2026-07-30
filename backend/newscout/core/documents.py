from django_opensearch_dsl import Document, fields
from django_opensearch_dsl.registries import registry

from .models import Article, ArticleTag, Category, Source


@registry.register_document
class ArticleDocument(Document):
    """OpenSearch document for Article with denormalized relations for search/facets."""

    title = fields.TextField(
        attr="title",
        fields={"raw": fields.KeywordField()},
    )
    author = fields.TextField(
        attr="author",
        fields={"raw": fields.KeywordField()},
    )
    summary = fields.TextField(attr="summary")
    content_url = fields.KeywordField(attr="content_url")
    image_url = fields.KeywordField(attr="image_url")
    published_at = fields.DateField(attr="published_at")

    trending = fields.BooleanField(attr="trending")
    featured = fields.BooleanField(attr="featured")
    editors_pick = fields.BooleanField(attr="editors_pick")
    is_breaking = fields.BooleanField(attr="is_breaking")

    category = fields.ObjectField(
        properties={
            "id": fields.IntegerField(),
            "name": fields.KeywordField(),
            "description": fields.TextField(),
            "popular": fields.BooleanField(),
            "parent": fields.IntegerField(),
        }
    )
    category_id = fields.IntegerField()

    source = fields.NestedField(
        properties={
            "id": fields.IntegerField(),
            "name": fields.KeywordField(),
            "url": fields.KeywordField(),
            "logo_url": fields.KeywordField(),
            "is_verified": fields.BooleanField(),
        }
    )
    source_ids = fields.IntegerField(multi=True)

    tags = fields.NestedField(
        properties={
            "id": fields.IntegerField(),
            "name": fields.KeywordField(),
        }
    )
    tag_ids = fields.IntegerField(multi=True)

    class Index:
        name = "articles"
        settings = {
            "number_of_shards": 1,
            "number_of_replicas": 0,
        }

    class Django:
        model = Article
        related_models = [Category, Source, ArticleTag]
        queryset_pagination = 500

    def get_queryset(self, filter_=None, exclude=None, count=None, alias=None):
        return (
            super()
            .get_queryset(filter_=filter_, exclude=exclude, count=count, alias=alias)
            .select_related("category")
            .prefetch_related("source", "tags")
        )

    def get_instances_from_related(self, related_instance):
        if isinstance(related_instance, Category):
            return related_instance.article_set.all()
        if isinstance(related_instance, Source):
            return related_instance.article_set.all()
        if isinstance(related_instance, ArticleTag):
            return related_instance.article_set.all()
        return Article.objects.none()

    def prepare_category(self, instance):
        category = instance.category
        if not category:
            return None
        return {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "popular": category.popular,
            "parent": category.parent_id,
        }

    def prepare_category_id(self, instance):
        return instance.category_id

    def prepare_source(self, instance):
        return [
            {
                "id": source.id,
                "name": source.name,
                "url": source.url,
                "logo_url": source.logo_url,
                "is_verified": source.is_verified,
            }
            for source in instance.source.all()
        ]

    def prepare_source_ids(self, instance):
        return list(instance.source.values_list("id", flat=True))

    def prepare_tags(self, instance):
        return [
            {"id": tag.id, "name": tag.name}
            for tag in instance.tags.all()
        ]

    def prepare_tag_ids(self, instance):
        return list(instance.tags.values_list("id", flat=True))
