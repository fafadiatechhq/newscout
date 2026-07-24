from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from core.models import Article, Category


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
