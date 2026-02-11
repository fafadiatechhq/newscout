from django.contrib import admin
from .models import Article, Category, Source, ArticleTag

admin.site.register(Article)
admin.site.register(Category)
admin.site.register(Source)
admin.site.register(ArticleTag)
