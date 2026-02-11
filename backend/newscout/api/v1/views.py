from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view
from core.models import Category, Source, ArticleTag, Article
from .serializers import (
    CategorySerializer,
    SourceSerializer,
    ArticleTagSerializer,
    ArticleSerializer
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
class CategoryViewSet(viewsets.ModelViewSet):
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
class SourceViewSet(viewsets.ModelViewSet):
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
class ArticleTagViewSet(viewsets.ModelViewSet):
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
        description="Retrieve a paginated list of all news articles. Supports filtering and pagination.",
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
class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing news articles.
    
    Articles are the core content entities in NewScout. Each article:
    - Belongs to a category (required)
    - Can have multiple sources (many-to-many)
    - Can have multiple tags (many-to-many, optional)
    - Can be marked as trending, featured, or editor's pick
    
    When creating/updating articles:
    - Use 'category_id' to set the category (write)
    - Use 'source_ids' array to set sources (write)
    - Use 'tag_ids' array to set tags (write)
    - Read operations return nested objects for category, sources, and tags
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer