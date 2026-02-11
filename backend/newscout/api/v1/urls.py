from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.v1.views import (
    CategoryAPI,
    SourceAPI,
    ArticleTagAPI,
    ArticleAPI,
    BookmarkAPI,
    PlanAPI,
    SubscriptionAPI,
    TenantAPI,
)

app_name = "api_v1"

router = DefaultRouter()
router.register(r"categories", CategoryAPI, basename="category")
router.register(r"sources", SourceAPI, basename="source")
router.register(r"tags", ArticleTagAPI, basename="article-tag")
router.register(r"articles", ArticleAPI, basename="article")
router.register(r"bookmarks", BookmarkAPI, basename="bookmark")
router.register(r"plans", PlanAPI, basename="plan")
router.register(r"subscriptions", SubscriptionAPI, basename="subscription")
router.register(r"tenants", TenantAPI, basename="tenant")

urlpatterns = [
    path("", include(router.urls)),
]
