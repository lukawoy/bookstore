from rest_framework import routers

from django.urls import include, path

from .views import (
    BookViewSet,
    ReviewViewSet,
    MyFavoriteViewSet,
    ActionFavoriteViewSet,
    MyShoppingListViewSet,
    ActionShoppingListViewSet,
)

router = routers.DefaultRouter()
router.register(r"books", BookViewSet)
router.register(r"books/(?P<book_id>\d+)/reviews", ReviewViewSet)
router.register(r"myfavorite", MyFavoriteViewSet, basename="myfavorite")
router.register(
    r"books/(?P<book_id>\d+)/favorite", ActionFavoriteViewSet, basename="favorite"
)
router.register(r"myshopinglist", MyShoppingListViewSet, basename="myshopinglist")
router.register(
    r"books/(?P<book_id>\d+)/shopinglist",
    ActionShoppingListViewSet,
    basename="shopinglist",
)


urlpatterns = [
    path("", include(router.urls)),
]
