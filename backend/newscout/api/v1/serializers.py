from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import Tenant
from billing.models import Plan, Subscription, SubscriptionStatus
from core.models import Article, ArticleTag, Bookmark, Category, Source


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
            "is_breaking",
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


class UserProfileSerializer(serializers.ModelSerializer):
    """Mobile-facing user profile (name + email)."""

    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "email"]
        read_only_fields = ["id", "name", "email"]

    def get_name(self, obj):
        full = obj.get_full_name().strip()
        if full:
            return full
        return obj.username


class SignupSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        email = value.lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        if User.objects.filter(username__iexact=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        name = validated_data["name"].strip()
        email = validated_data["email"]
        password = validated_data["password"]

        parts = name.split(None, 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ""

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs["email"].lower().strip()
        password = attrs["password"]

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is disabled.")

        attrs["user"] = user
        return attrs


def tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


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
