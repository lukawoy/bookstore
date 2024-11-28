from django.urls import include, path
from rest_framework_simplejwt import views

urlpatterns = [
    path("auth/login/", views.TokenObtainPairView.as_view(), name="jwt-create"),
    path("", include("djoser.urls")),
]
