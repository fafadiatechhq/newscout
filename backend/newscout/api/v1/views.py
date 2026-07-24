from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, extend_schema_view
from django_filters.rest_framework import DjangoFilterBackend

from core.models import Category, Source, ArticleTag, Article, Bookmark
from billing.models import Plan, Subscription
from accounts.models import Tenant
from .filters import ArticleFilter
from .serializers import (
    CategorySerializer,
    SourceSerializer,
    ArticleTagSerializer,
    ArticleSerializer,
    BookmarkSerializer,
    PlanSerializer,
    SubscriptionSerializer,
    TenantSerializer,
)


@extend_schema_view(
    list=extend_schema(
        summary="List all categories",
        description="Retrieve a paginated list of all news categories. Categories can have parent-child relationships.",
        tags=["Categories"],
    ),
    create=extend_schema(
        summary="Create a new category",
        description="Create a new news category. Categories can optionally have a parent category.",
        tags=["Categories"],
    ),
    retrieve=extend_schema(
        summary="Retrieve a category",
        description="Get detailed information about a specific category by ID.",
        tags=["Categories"],
    ),
    update=extend_schema(
        summary="Update a category",
        description="Update all fields of a category. Use PATCH for partial updates.",
        tags=["Categories"],
    ),
    partial_update=extend_schema(
        summary="Partially update a category",
        description="Update specific fields of a category.",
        tags=["Categories"],
    ),
    destroy=extend_schema(
        summary="Delete a category",
        description="Delete a category. This will cascade delete child categories.",
        tags=["Categories"],
    ),
)
class CategoryAPI(viewsets.ModelViewSet):
    """
    ViewSet for managing news article categories.

    Categories support hierarchical structures with parent-child relationships.
    Categories can be marked as popular for featured display.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@extend_schema_view(
    list=extend_schema(
        summary="List all sources",
        description="Retrieve a paginated list of all news sources and publishers.",
        tags=["Sources"],
    ),
    create=extend_schema(
        summary="Create a new source",
        description="Add a new news source or publisher to the system.",
        tags=["Sources"],
    ),
    retrieve=extend_schema(
        summary="Retrieve a source",
        description="Get detailed information about a specific news source by ID.",
        tags=["Sources"],
    ),
    update=extend_schema(
        summary="Update a source",
        description="Update all fields of a news source. Use PATCH for partial updates.",
        tags=["Sources"],
    ),
    partial_update=extend_schema(
        summary="Partially update a source",
        description="Update specific fields of a news source.",
        tags=["Sources"],
    ),
    destroy=extend_schema(
        summary="Delete a source",
        description="Delete a news source from the system.",
        tags=["Sources"],
    ),
)
class SourceAPI(viewsets.ModelViewSet):
    """
    ViewSet for managing news sources and publishers.

    Sources represent news publishers, blogs, or other content providers.
    Sources can be verified to indicate trustworthiness.
    """

    queryset = Source.objects.all()
    serializer_class = SourceSerializer


@extend_schema_view(
    list=extend_schema(
        summary="List all article tags",
        description="Retrieve a paginated list of all article tags used for categorization.",
        tags=["Article Tags"],
    ),
    create=extend_schema(
        summary="Create a new article tag",
        description="Create a new tag that can be used to categorize articles.",
        tags=["Article Tags"],
    ),
    retrieve=extend_schema(
        summary="Retrieve an article tag",
        description="Get detailed information about a specific article tag by ID.",
        tags=["Article Tags"],
    ),
    update=extend_schema(
        summary="Update an article tag",
        description="Update all fields of an article tag. Use PATCH for partial updates.",
        tags=["Article Tags"],
    ),
    partial_update=extend_schema(
        summary="Partially update an article tag",
        description="Update specific fields of an article tag.",
        tags=["Article Tags"],
    ),
    destroy=extend_schema(
        summary="Delete an article tag",
        description="Delete an article tag from the system.",
        tags=["Article Tags"],
    ),
)
class ArticleTagAPI(viewsets.ModelViewSet):
    """
    ViewSet for managing article tags.

    Tags are used to categorize and organize articles beyond their primary category.
    Articles can have multiple tags for flexible categorization.
    """

    queryset = ArticleTag.objects.all()
    serializer_class = ArticleTagSerializer


@extend_schema_view(
    list=extend_schema(
        summary="List all articles",
        description=(
            "Retrieve a paginated list of news articles. "
            "Supports filtering by category_id, is_breaking, trending, featured, "
            "and editors_pick; full-text search via ?search=; "
            "and limit/offset pagination."
        ),
        tags=["Articles"],
    ),
    create=extend_schema(
        summary="Create a new article",
        description="Create a new news article. Requires category_id. Sources and tags are optional.",
        tags=["Articles"],
    ),
    retrieve=extend_schema(
        summary="Retrieve an article",
        description="Get detailed information about a specific article by ID, including related sources, category, and tags.",
        tags=["Articles"],
    ),
    update=extend_schema(
        summary="Update an article",
        description="Update all fields of an article. Use PATCH for partial updates.",
        tags=["Articles"],
    ),
    partial_update=extend_schema(
        summary="Partially update an article",
        description="Update specific fields of an article.",
        tags=["Articles"],
    ),
    destroy=extend_schema(
        summary="Delete an article",
        description="Delete an article from the system.",
        tags=["Articles"],
    ),
)
class ArticleAPI(viewsets.ModelViewSet):
    """
    ViewSet for managing news articles.

    Articles are the core content entities in NewScout. Each article:
    - Belongs to a category (required)
    - Can have multiple sources (many-to-many)
    - Can have multiple tags (many-to-many, optional)
    - Can be marked as trending, featured, editor's pick, or breaking

    List query params:
    - category / category_id: filter by category PK
    - is_breaking, trending, featured, editors_pick: boolean filters
    - search: search title, summary, and author
    - limit / offset: pagination (default limit 20)

    When creating/updating articles:
    - Use 'category_id' to set the category (write)
    - Use 'source_ids' array to set sources (write)
    - Use 'tag_ids' array to set tags (write)
    - Read operations return nested objects for category, sources, and tags
    """

    queryset = Article.objects.select_related("category").prefetch_related(
        "source", "tags"
    )
    serializer_class = ArticleSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = ArticleFilter
    search_fields = ["title", "summary", "author"]
    ordering_fields = ["published_at", "id"]
    ordering = ["-published_at", "-id"]


@extend_schema_view(
    list=extend_schema(
        summary="List user's bookmarks",
        description="Retrieve a paginated list of all bookmarks belonging to the authenticated user.",
        tags=["Bookmarks"],
    ),
    create=extend_schema(
        summary="Create a new bookmark",
        description="Create a new bookmark for an article. The bookmark will be automatically associated with the authenticated user.",
        tags=["Bookmarks"],
    ),
    retrieve=extend_schema(
        summary="Retrieve a bookmark",
        description="Get detailed information about a specific bookmark by ID. Users can only access their own bookmarks.",
        tags=["Bookmarks"],
    ),
    update=extend_schema(
        summary="Update a bookmark",
        description="Update a bookmark. Use PATCH for partial updates. Users can only update their own bookmarks.",
        tags=["Bookmarks"],
    ),
    partial_update=extend_schema(
        summary="Partially update a bookmark",
        description="Update specific fields of a bookmark. Users can only update their own bookmarks.",
        tags=["Bookmarks"],
    ),
    destroy=extend_schema(
        summary="Delete a bookmark",
        description="Delete a bookmark. Users can only delete their own bookmarks.",
        tags=["Bookmarks"],
    ),
)
class BookmarkAPI(viewsets.ModelViewSet):
    """
    ViewSet for managing user bookmarks.

    Bookmarks allow users to save articles for later reading. Each bookmark:
    - Is associated with a user (automatically set from authenticated user)
    - References a single article
    - Has timestamps for creation and last update

    Security:
    - Only authenticated users can access bookmarks
    - Users can only view, create, update, and delete their own bookmarks
    - The user field is automatically set from the request context

    When creating/updating bookmarks:
    - Use 'article_id' to set the article (write)
    - Read operations return nested objects for article and user
    """

    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@extend_schema_view(
    list=extend_schema(
        summary="List all plans",
        description="Retrieve a paginated list of all available subscription plans.",
        tags=["Plans"],
    ),
    create=extend_schema(
        summary="Create a new plan",
        description="Create a new subscription plan. Typically restricted to platform administrators.",
        tags=["Plans"],
    ),
    retrieve=extend_schema(
        summary="Retrieve a plan",
        description="Get detailed information about a specific subscription plan by ID.",
        tags=["Plans"],
    ),
    update=extend_schema(
        summary="Update a plan",
        description="Update all fields of a subscription plan. Use PATCH for partial updates. Typically restricted to platform administrators.",
        tags=["Plans"],
    ),
    partial_update=extend_schema(
        summary="Partially update a plan",
        description="Update specific fields of a subscription plan. Typically restricted to platform administrators.",
        tags=["Plans"],
    ),
    destroy=extend_schema(
        summary="Delete a plan",
        description="Delete a subscription plan. Typically restricted to platform administrators.",
        tags=["Plans"],
    ),
)
class PlanAPI(viewsets.ModelViewSet):
    """
    ViewSet for managing subscription plans.

    Plans define pricing tiers and features available to tenants. Each plan:
    - Has a name, description, and price
    - Can be associated with multiple subscriptions
    - Has timestamps for creation and last update

    Note: Plan management (create/update/delete) is typically restricted to platform administrators,
    while plan viewing is available to authenticated users to see available options.
    """

    queryset = Plan.objects.all()
    serializer_class = PlanSerializer


@extend_schema_view(
    list=extend_schema(
        summary="List tenant's subscriptions",
        description="Retrieve a paginated list of all subscriptions for the authenticated user's tenant.",
        tags=["Subscriptions"],
    ),
    create=extend_schema(
        summary="Create a new subscription",
        description="Create a new subscription for a tenant. Requires tenant_id and plan_id.",
        tags=["Subscriptions"],
    ),
    retrieve=extend_schema(
        summary="Retrieve a subscription",
        description="Get detailed information about a specific subscription by ID. Users can only access subscriptions for their tenant.",
        tags=["Subscriptions"],
    ),
    update=extend_schema(
        summary="Update a subscription",
        description="Update a subscription. Use PATCH for partial updates. Users can only update subscriptions for their tenant.",
        tags=["Subscriptions"],
    ),
    partial_update=extend_schema(
        summary="Partially update a subscription",
        description="Update specific fields of a subscription (e.g., status, dates). Users can only update subscriptions for their tenant.",
        tags=["Subscriptions"],
    ),
    destroy=extend_schema(
        summary="Delete a subscription",
        description="Delete a subscription. Users can only delete subscriptions for their tenant.",
        tags=["Subscriptions"],
    ),
)
class SubscriptionAPI(viewsets.ModelViewSet):
    """
    ViewSet for managing tenant subscriptions.

    Subscriptions link tenants to plans and track billing status. Each subscription:
    - Is associated with a tenant (organization)
    - References a plan (pricing tier)
    - Has a status (active, inactive, cancelled, expired, etc.)
    - Has start and end dates
    - Has timestamps for creation and last update

    Security:
    - Only authenticated users can access subscriptions
    - Users can only view, create, update, and delete subscriptions for their tenant
    - The tenant is determined from the authenticated user's tenant association

    When creating/updating subscriptions:
    - Use 'tenant_id' to set the tenant (write)
    - Use 'plan_id' to set the plan (write)
    - Use 'status' to set subscription status (choices: active, inactive, cancelled, expired, pending, failed, refunded, other)
    - Read operations return nested objects for tenant and plan
    """

    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only subscriptions for the authenticated user's tenant."""
        if not hasattr(self.request.user, "tenant"):
            return Subscription.objects.none()

        tenant = self.request.user.tenant_set.first()
        if not tenant:
            return Subscription.objects.none()

        return Subscription.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        """Automatically set the tenant if not provided, based on the authenticated user."""
        # If tenant_id is not provided, try to get it from user's tenant
        if "tenant" not in serializer.validated_data:
            raise AttributeError("Tenant not found")

        tenant = self.request.user.tenant_set.first()
        serializer.save(tenant=tenant)


@extend_schema_view(
    list=extend_schema(
        summary="List user's tenants",
        description="Retrieve a paginated list of all tenants owned by the authenticated user.",
        tags=["Tenants"],
    ),
    create=extend_schema(
        summary="Create a new tenant",
        description="Create a new tenant organization (self-serve signup). The owner will be automatically set to the authenticated user if not specified.",
        tags=["Tenants"],
    ),
    retrieve=extend_schema(
        summary="Retrieve a tenant",
        description="Get detailed information about a specific tenant by ID. Users can only access tenants they own.",
        tags=["Tenants"],
    ),
    update=extend_schema(
        summary="Update a tenant",
        description="Update all fields of a tenant. Use PATCH for partial updates. Users can only update tenants they own.",
        tags=["Tenants"],
    ),
    partial_update=extend_schema(
        summary="Partially update a tenant",
        description="Update specific fields of a tenant (e.g., name). Users can only update tenants they own.",
        tags=["Tenants"],
    ),
    destroy=extend_schema(
        summary="Delete a tenant",
        description="Delete a tenant. Users can only delete tenants they own. This will cascade delete related subscriptions.",
        tags=["Tenants"],
    ),
)
class TenantAPI(viewsets.ModelViewSet):
    """
    ViewSet for managing tenant organizations.

    Tenants represent organizations or workspaces with isolated data, users, and billing. Each tenant:
    - Has a name and an owner (user)
    - Can have multiple subscriptions
    - Has timestamps for creation and last update

    Security:
    - Only authenticated users can access tenants
    - Users can only view, create, update, and delete tenants they own
    - The owner field is automatically set from the authenticated user context when creating

    When creating/updating tenants:
    - Use 'owner_id' to set the owner (write, optional - defaults to authenticated user)
    - Read operations return nested objects for owner
    - Users can update the tenant name
    """

    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only tenants owned by the authenticated user."""
        return Tenant.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """Automatically set the owner to the authenticated user if not provided."""
        if "owner" not in serializer.validated_data:
            serializer.save(owner=self.request.user)
        else:
            serializer.save()
