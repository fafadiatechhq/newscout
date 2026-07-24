from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import (
    LoginSerializer,
    SignupSerializer,
    UserProfileSerializer,
    tokens_for_user,
)


class SignupView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=SignupSerializer,
        responses={201: UserProfileSerializer},
        summary="Register a new user",
        tags=["Auth"],
    )
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = tokens_for_user(user)
        return Response(
            {
                "user": UserProfileSerializer(user).data,
                **tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=LoginSerializer,
        responses={200: UserProfileSerializer},
        summary="Log in with email and password",
        tags=["Auth"],
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        tokens = tokens_for_user(user)
        return Response(
            {
                "user": UserProfileSerializer(user).data,
                **tokens,
            }
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: UserProfileSerializer},
        summary="Get the current authenticated user",
        tags=["Auth"],
    )
    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Log out (client should discard tokens)",
        tags=["Auth"],
        responses={204: None},
    )
    def post(self, request):
        # JWT is stateless; clients discard tokens. Endpoint exists for mobile parity.
        return Response(status=status.HTTP_204_NO_CONTENT)


class AuthTokenRefreshView(TokenRefreshView):
    @extend_schema(summary="Refresh an access token", tags=["Auth"])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
