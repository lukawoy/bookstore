from rest_framework import routers

from django.urls import include, path

from .views import BookViewSet, ReviewViewSet, MyFavoriteViewSet

router = routers.DefaultRouter()
router.register(r"books", BookViewSet)
router.register(r"books/(?P<book_id>\d+)/reviews", ReviewViewSet)
router.register(r"myfavorite", MyFavoriteViewSet, basename="favorite")

urlpatterns = [
    path("", include(router.urls)),
]
