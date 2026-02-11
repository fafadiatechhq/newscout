from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'api_v1'

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'sources', views.SourceViewSet, basename='source')
router.register(r'tags', views.ArticleTagViewSet, basename='article-tag')
router.register(r'articles', views.ArticleViewSet, basename='article')

urlpatterns = [
    path('', include(router.urls)),
]
