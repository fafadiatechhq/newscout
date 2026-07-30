from django.contrib.auth.models import User
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from api.v1.search_views import opensearch_is_available
from core.documents import ArticleDocument
from core.models import Article, ArticleTag, Category, Source


class AuthApiTests(APITestCase):
    def test_signup_login_and_me(self):
        signup = self.client.post(
            "/api/v1/auth/signup/",
            {
                "name": "Ada Lovelace",
                "email": "ada@example.com",
                "password": "CorrectHorseBattery1",
            },
            format="json",
        )
        self.assertEqual(signup.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", signup.data)
        self.assertEqual(signup.data["user"]["email"], "ada@example.com")
        self.assertEqual(signup.data["user"]["name"], "Ada Lovelace")

        login = self.client.post(
            "/api/v1/auth/login/",
            {"email": "ada@example.com", "password": "CorrectHorseBattery1"},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        token = login.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        me = self.client.get("/api/v1/auth/me/")
        self.assertEqual(me.status_code, status.HTTP_200_OK)
        self.assertEqual(me.data["email"], "ada@example.com")

    def test_login_rejects_bad_password(self):
        User.objects.create_user(
            username="bob@example.com",
            email="bob@example.com",
            password="CorrectHorseBattery1",
        )
        response = self.client.post(
            "/api/v1/auth/login/",
            {"email": "bob@example.com", "password": "wrong"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


@override_settings(OPENSEARCH_DSL_AUTOSYNC=False)
class ArticleApiTests(APITestCase):
    def setUp(self):
        self.cat = Category.objects.create(name="Technology")
        Article.objects.create(
            title="Breaking AI news",
            summary="Something important",
            category=self.cat,
            is_breaking=True,
        )
        Article.objects.create(
            title="Quiet update",
            summary="Not urgent",
            category=self.cat,
            is_breaking=False,
        )

    def test_filter_breaking_and_search(self):
        breaking = self.client.get("/api/v1/articles/", {"is_breaking": "true"})
        self.assertEqual(breaking.status_code, status.HTTP_200_OK)
        self.assertEqual(breaking.data["count"], 1)
        self.assertTrue(breaking.data["results"][0]["is_breaking"])

        search = self.client.get("/api/v1/articles/", {"search": "Quiet"})
        self.assertEqual(search.status_code, status.HTTP_200_OK)
        self.assertEqual(search.data["count"], 1)
        self.assertIn("Quiet", search.data["results"][0]["title"])

    def test_limit_offset_pagination(self):
        response = self.client.get(
            "/api/v1/articles/", {"limit": "1", "offset": "0"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["count"], 2)

    def test_filter_by_category_id(self):
        other = Category.objects.create(name="Sports")
        Article.objects.create(title="Match day", category=other)
        response = self.client.get(
            "/api/v1/articles/", {"category_id": str(self.cat.id)}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)


@override_settings(OPENSEARCH_DSL_AUTOSYNC=True, OPENSEARCH_DSL_AUTO_REFRESH=True)
class ArticleSearchApiTests(APITestCase):
    """Integration tests against a live OpenSearch instance (skipped if unreachable)."""

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.opensearch_ready = opensearch_is_available()
        if cls.opensearch_ready:
            index = ArticleDocument._index
            if not index.exists():
                index.create()

    @classmethod
    def tearDownClass(cls):
        # Restore Compose-stack index contents from Postgres after test isolation.
        if getattr(cls, "opensearch_ready", False):
            try:
                index = ArticleDocument._index
                if not index.exists():
                    index.create()
                ArticleDocument().update(
                    Article.objects.all(), action="index", refresh=True
                )
            except Exception:
                pass
        super().tearDownClass()

    def setUp(self):
        if not self.opensearch_ready:
            self.skipTest("OpenSearch is not available")

        # Isolate each test from leftover OpenSearch documents
        ArticleDocument.search().query("match_all").delete()
        ArticleDocument._index.refresh()

        self.cat = Category.objects.create(name="Technology")
        self.other_cat = Category.objects.create(name="Sports")
        self.source = Source.objects.create(name="TechDaily", is_verified=True)
        self.tag = ArticleTag.objects.create(name="AI")

        self.breaking = Article.objects.create(
            title="Breaking AI news",
            summary="Something important about models",
            author="Ada",
            category=self.cat,
            is_breaking=True,
            trending=True,
        )
        self.breaking.source.set([self.source])
        self.breaking.tags.set([self.tag])

        self.quiet = Article.objects.create(
            title="Quiet update",
            summary="Not urgent sports note",
            category=self.other_cat,
            is_breaking=False,
        )

        # Ensure documents are searchable immediately
        ArticleDocument().update(self.breaking, action="index", refresh=True)
        ArticleDocument().update(self.quiet, action="index", refresh=True)

    def test_search_by_query(self):
        response = self.client.get("/api/v1/search/", {"q": "Quiet"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertIn("Quiet", response.data["results"][0]["title"])
        self.assertIn("aggregations", response.data)
        self.assertIn("categories", response.data["aggregations"])
        self.assertIn("flags", response.data["aggregations"])

    def test_search_filter_breaking_and_aggregations(self):
        response = self.client.get(
            "/api/v1/search/", {"is_breaking": "true", "category_id": self.cat.id}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertTrue(response.data["results"][0]["is_breaking"])
        self.assertGreaterEqual(response.data["aggregations"]["flags"]["is_breaking"], 1)
        category_ids = [c["id"] for c in response.data["aggregations"]["categories"]]
        self.assertIn(self.cat.id, category_ids)

    def test_search_pagination(self):
        response = self.client.get("/api/v1/search/", {"limit": 1, "offset": 0})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["count"], 2)
        self.assertIsNotNone(response.data["next"])
