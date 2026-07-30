from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.v1.auth_views import (
    AuthTokenRefreshView,
    LoginView,
    LogoutView,
    MeView,
    SignupView,
)
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
from api.v1.search_views import ArticleSearchAPI

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
    path("auth/signup/", SignupView.as_view(), name="auth-signup"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("auth/token/refresh/", AuthTokenRefreshView.as_view(), name="auth-token-refresh"),
    path("search/", ArticleSearchAPI.as_view(), name="article-search"),
    path("", include(router.urls)),
]
