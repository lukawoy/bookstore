from rest_framework import routers

from django.urls import include, path


urlpatterns = [
    path("auth/", include("djoser.urls.jwt")),
    path("", include("djoser.urls")),
]
