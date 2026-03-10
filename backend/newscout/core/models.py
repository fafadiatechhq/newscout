from django.db import models
from django.contrib.auth.models import User
from accounts.models import Tenant

class Category(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    popular = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Source(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField(blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class ArticleTag(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Article(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    content_url = models.URLField(blank=True, null=True)
    source = models.ManyToManyField(Source)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    tags = models.ManyToManyField(ArticleTag, blank=True)
    published_at = models.DateTimeField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    trending = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    editors_pick = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.article.title}"
