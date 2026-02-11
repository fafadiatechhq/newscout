from rest_framework import serializers
from django.contrib.auth.models import User
from core.models import Category, Source, ArticleTag, Article, Bookmark
from billing.models import Plan, Subscription, SubscriptionStatus
from accounts.models import Tenant


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        read_only_fields = ("id",)


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = "__all__"
        read_only_fields = ("id",)


class ArticleTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleTag
        fields = "__all__"
        read_only_fields = ("id",)


class ArticleSerializer(serializers.ModelSerializer):
    source = SourceSerializer(many=True, read_only=True)
    source_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Source.objects.all(),
        write_only=True,
        required=False,
        source="source",
    )
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True, source="category"
    )
    tags = ArticleTagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ArticleTag.objects.all(),
        write_only=True,
        required=False,
        source="tags",
    )

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "author",
            "summary",
            "content_url",
            "source",
            "source_ids",
            "category",
            "category_id",
            "tags",
            "tag_ids",
            "published_at",
            "image_url",
            "trending",
            "featured",
            "editors_pick",
        ]
        read_only_fields = ("id",)

    def create(self, validated_data):
        source = validated_data.pop("source", [])
        tags = validated_data.pop("tags", [])
        category = validated_data.pop("category")

        article = Article.objects.create(category=category, **validated_data)

        if source:
            article.source.set(source)
        if tags:
            article.tags.set(tags)

        return article

    def update(self, instance, validated_data):
        source = validated_data.pop("source", None)
        tags = validated_data.pop("tags", None)
        category = validated_data.pop("category", None)

        if category:
            instance.category = category

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if source is not None:
            instance.source.set(source)
        if tags is not None:
            instance.tags.set(tags)

        return instance


class UserSerializer(serializers.ModelSerializer):
    """Simple serializer for user representation in bookmarks."""

    class Meta:
        model = User
        fields = ["id", "username", "email"]
        read_only_fields = ["id", "username", "email"]


class BookmarkSerializer(serializers.ModelSerializer):
    article = ArticleSerializer(read_only=True)
    article_id = serializers.PrimaryKeyRelatedField(
        queryset=Article.objects.all(), write_only=True, source="article"
    )
    user = UserSerializer(read_only=True)

    class Meta:
        model = Bookmark
        fields = ["id", "user", "article", "article_id", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]


class TenantSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    owner_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, required=False, source="owner"
    )

    class Meta:
        model = Tenant
        fields = ["id", "name", "owner", "owner_id", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ["id", "name", "description", "price", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class SubscriptionSerializer(serializers.ModelSerializer):
    tenant = TenantSerializer(read_only=True)
    tenant_id = serializers.PrimaryKeyRelatedField(
        queryset=Tenant.objects.all(), write_only=True, source="tenant"
    )
    plan = PlanSerializer(read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=Plan.objects.all(), write_only=True, source="plan"
    )
    status = serializers.ChoiceField(choices=SubscriptionStatus.choices)

    class Meta:
        model = Subscription
        fields = [
            "id",
            "tenant",
            "tenant_id",
            "plan",
            "plan_id",
            "status",
            "start_date",
            "end_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
