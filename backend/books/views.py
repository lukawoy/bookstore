from http import HTTPStatus

from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from rest_framework import filters, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Book, Favourites, Review, ShoppingList
from .permissions import AuthorPermission
from .serializers import (
    BookSerializer,
    FavoriteSerializer,
    ReviewSerializer,
    ShoppingListSerializer,
)


class BookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Book.objects.annotate(
        rating=Avg("book_review__score"), number_reviews=Count("book_review")
    ).order_by("?")
    serializer_class = BookSerializer
    permission_classes = (AllowAny,)
    filter_backends = [filters.SearchFilter]
    search_fields = ["title"]

    def list(self, request, *args, **kwargs):
        """Получить список всех книг."""
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """Получить книгу по ID."""
        return super().retrieve(request, *args, **kwargs)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = (AuthorPermission,)
    http_method_names = ["post", "get", "delete", "put"]

    def perform_create(self, serializer):
        serializer.save(
            author_review=self.request.user,
            book=get_object_or_404(Book, id=self.kwargs.get("book_id")),
        )

    def get_queryset(self):
        return Review.objects.filter(book=self.kwargs.get("book_id"))

    def create(self, request, *args, **kwargs):
        """Создать новый отзыв для книги по её ID."""
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Редактировать отзыв по ID для книги по её ID."""
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Удалить отзыв по ID для книги по её ID."""
        return super().destroy(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        """Получить все отзывы для книги по её ID."""
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """Получить отзыв по ID для книги по её ID."""
        return super().retrieve(request, *args, **kwargs)


class MyFavoriteViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Favourites.objects.filter(user=self.request.user).annotate(
            number_reviews=Count("book__book_review")
        )

    def list(self, request, *args, **kwargs):
        """Получить список всех избранных книг."""
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """Получить книгу по её ID в избранном."""
        return super().retrieve(request, *args, **kwargs)


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

    def create(self, request, *args, **kwargs):
        """Добавить книгу в избранное по её ID."""
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Удалить книгу из избранного по её ID."""
        return super().destroy(request, *args, **kwargs)


class MyShoppingListViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ShoppingListSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return ShoppingList.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        """Получить список всех книг в корзине."""
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """Получить книгу по её ID в корзине."""
        return super().retrieve(request, *args, **kwargs)


class ActionShoppingListViewSet(ActionFavoriteViewSet):
    serializer_class = ShoppingListSerializer

    def delete(self, request, book_id):
        book = get_object_or_404(Book, id=book_id)
        if not book.shoppinglist_book.filter(user__id=request.user.id).exists():
            return Response(
                {"errors": "Этой книги нет в корзине."}, status=HTTPStatus.BAD_REQUEST
            )

        get_object_or_404(
            ShoppingList,
            user=self.request.user,
            book=get_object_or_404(Book, id=book_id),
        ).delete()
        return Response(status=HTTPStatus.NO_CONTENT)

    def create(self, request, *args, **kwargs):
        """Добавить книгу в корзину по её ID."""
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Удалить книгу из корзины по её ID."""
        return super().destroy(request, *args, **kwargs)
