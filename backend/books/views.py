from django.shortcuts import render
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Book, Favourites, ShoppingList, Review
from .serializers import (
    BookSerializer,
    ReviewSerializer,
    FavoriteSerializer,
    ShoppingListSerializer,
)
from .permissions import AuthorPermission
from rest_framework.response import Response
from http import HTTPStatus
from django.db.models import Avg, Count


class BookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Book.objects.annotate(
        rating=Avg("book_review__score"), number_reviews=Count("book_review")
    )
    serializer_class = BookSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = (AuthorPermission,)

    def perform_create(self, serializer):
        serializer.save(
            author_review=self.request.user,
            book=get_object_or_404(Book, id=self.kwargs.get("book_id")),
        )


class MyFavoriteViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Favourites.objects.filter(user=self.request.user)


class ActionFavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ["post", "delete"]

    def get_queryset(self):
        return Favourites.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            book=get_object_or_404(Book, id=self.kwargs.get("book_id")),
        )

    def delete(self, request, book_id):
        book = get_object_or_404(Book, id=book_id)
        if not book.favourites_book.filter(user__id=request.user.id).exists():
            return Response(
                {"errors": "Этой книги нет в избранном."}, status=HTTPStatus.BAD_REQUEST
            )

        get_object_or_404(
            Favourites,
            user=self.request.user,
            book=get_object_or_404(Book, id=book_id),
        ).delete()
        return Response(status=HTTPStatus.NO_CONTENT)


class MyShoppingListViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ShoppingListSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return ShoppingList.objects.filter(user=self.request.user)


class ActionShoppingListViewSet(ActionFavoriteViewSet):
    serializer_class = ShoppingListSerializer

    def delete(self, request, book_id):
        book = get_object_or_404(Book, id=book_id)
        if not book.shoppinglist_book.filter(user__id=request.user.id).exists():
            return Response(
                {"errors": "Этой книги нет в корзине."},
                status=HTTPStatus.BAD_REQUEST
            )
        
        get_object_or_404(
            ShoppingList,
            user=self.request.user,
            book=get_object_or_404(Book, id=book_id),
        ).delete()
        return Response(status=HTTPStatus.NO_CONTENT)
