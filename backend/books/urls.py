from django.urls import include, path
from rest_framework import routers

from .views import (BookViewSet, MyFavoriteViewSet, MyShoppingListViewSet,
                    ReviewViewSet)

router = routers.DefaultRouter()
router.register(r"books", BookViewSet)
router.register(r"books/(?P<book_id>\d+)/reviews", ReviewViewSet, basename="reviews")
router.register(r"myfavorite", MyFavoriteViewSet, basename="myfavorite")
router.register(r"myshopinglist", MyShoppingListViewSet, basename="myshopinglist")


urlpatterns = [
    path("", include(router.urls)),
]
