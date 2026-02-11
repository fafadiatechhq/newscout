from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = "api_v1"

router = DefaultRouter()
router.register(r"categories", views.CategoryViewSet, basename="category")
router.register(r"sources", views.SourceViewSet, basename="source")
router.register(r"tags", views.ArticleTagViewSet, basename="article-tag")
router.register(r"articles", views.ArticleViewSet, basename="article")
router.register(r"bookmarks", views.BookmarkViewSet, basename="bookmark")
router.register(r"plans", views.PlanViewSet, basename="plan")
router.register(r"subscriptions", views.SubscriptionViewSet, basename="subscription")
router.register(r"tenants", views.TenantViewSet, basename="tenant")

urlpatterns = [
    path("", include(router.urls)),
]
