from django.contrib.auth import get_user_model
from django.db.models import Avg, Count
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import (OpenApiParameter, extend_schema,
                                   extend_schema_view)
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Book, Review, ShoppingList
from .permissions import AuthorPermission
from .serializers import BookSerializer, ReviewSerializer

User = get_user_model()


@receiver(post_save, sender=User)
def my_handler(sender, instance, **kwargs):
    ShoppingList.objects.get_or_create(user=instance)


@extend_schema(tags=["Books"])
@extend_schema_view(
    list=extend_schema(
        summary="Список книг",
    ),
    retrieve=extend_schema(summary="Детальная информация о книге"),
)
class BookViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Book.objects.annotate(
        rating=Avg("book_review__score"), number_reviews=Count("book_review")
    ).prefetch_related("author")
    serializer_class = BookSerializer
    permission_classes = (AllowAny,)
    filter_backends = [filters.SearchFilter]
    search_fields = ["title"]

    @extend_schema(
        summary="Рандомный список книг",
    )
    @action(detail=False, methods=["GET"])
    def random_book(self, request):
        random_books = Book.objects.prefetch_related("author").order_by("?")[:5]
        serializer = self.get_serializer(random_books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Добавить книгу в избранное", methods=["POST"], tags=["Favorite"]
    )
    @extend_schema(
        summary="Удалить книгу из избранного", methods=["DELETE"], tags=["Favorite"]
    )
    @action(
        detail=True, methods=["POST", "DELETE"], permission_classes=(IsAuthenticated,)
    )
    def favorite(self, request, pk):
        book = Book.objects.get(id=pk)
        user = request.user
        if request.method == "POST":
            if (
                user.favorites_books.prefetch_related("favorites")
                .filter(id=pk)
                .exists()
            ):
                return Response(
                    {"message": "Данная книга уже в избранном!"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            book.favorites.add(user)
            return Response(status=status.HTTP_201_CREATED)

        if user.favorites_books.prefetch_related("favorites").filter(id=pk).exists():
            book.favorites.remove(user)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            {"message": "Данной книги нет в избранном!"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def get_cart(self):
        cart, created = ShoppingList.objects.get_or_create(user=self.request.user)
        return cart

    @extend_schema(summary="Добавить книгу в корзину", tags=["Cart"])
    @action(
        detail=True,
        methods=["POST"],
        url_path="add-to-cart",
        permission_classes=(IsAuthenticated,),
    )
    def add_book_to_cart(self, request, pk):
        cart = self.get_cart()
        current_book = get_object_or_404(Book, id=pk)
        cart.book.add(current_book)
        return Response(status=status.HTTP_201_CREATED)

    @extend_schema(summary="Удалить книгу из корзины", tags=["Cart"])
    @action(
        detail=True,
        methods=["DELETE"],
        url_path="remove-book-from-cart",
        permission_classes=(IsAuthenticated,),
    )
    def remove_book_from_cart(self, request, pk):
        cart = self.get_cart()
        current_book = get_object_or_404(Book, id=pk)

        cart.book.remove(current_book)
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(tags=["Review"])
@extend_schema_view(
    list=extend_schema(
        summary="Список отзывов для книги",
    ),
    retrieve=extend_schema(summary="Детальная информация об отзыве"),
    create=extend_schema(
        summary="Создать отзыв",
    ),
    update=extend_schema(
        summary="Обновить отзыв",
    ),
    destroy=extend_schema(
        summary="Удалить отзыв",
    ),
)
class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = (AuthorPermission,)
    http_method_names = ["post", "get", "delete", "put"]

    def perform_create(self, serializer):
        serializer.save(
            author_review=self.request.user,
            book=get_object_or_404(Book, id=self.kwargs.get("book_id")),
        )

    def get_queryset(self):
        return Review.objects.filter(book=self.kwargs.get("book_id")).select_related(
            "author_review", "book"
        )


@extend_schema(tags=["Favorite"])
@extend_schema_view(
    list=extend_schema(
        summary="Список избранных книг",
    ),
    retrieve=extend_schema(
        summary="Детальная информация о избранной книге",
        parameters=[
            OpenApiParameter(name="id", location=OpenApiParameter.PATH, type=int)
        ],
    ),
)
class MyFavoriteViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return (
            user.favorites_books.prefetch_related("favorites")
            .all()
            .annotate(number_reviews=Count("book_review"))
        )


@extend_schema(tags=["Cart"])
@extend_schema_view(
    list=extend_schema(
        summary="Список книг в корзине",
    ),
    retrieve=extend_schema(
        summary="Детальная информация о книге в корзине",
        parameters=[
            OpenApiParameter(name="id", location=OpenApiParameter.PATH, type=int)
        ],
    ),
)
class MyShoppingListViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Book.objects.filter(
            shoppinglist_book=user.shoppinglist_user
        ).prefetch_related("author")
