import os
from rest_framework import serializers
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
import base64

from .models import Book, Favourites, ShoppingList, Review, Author
from users.serializers import UserSerializer


class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith("data:image"):
            format, imgstr = data.split(";base64,")
            ext = format.split("/")[-1]
            data = ContentFile(base64.b64decode(imgstr), name="temp." + ext)
        return super().to_internal_value(data)


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = (
            "id",
            "first_name",
            "middle_name",
            "last_name",
        )


class BookSerializer(serializers.ModelSerializer):
    image = Base64ImageField()
    author = AuthorSerializer(many=True, read_only=True)
    rating = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    number_reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = Book
        fields = (
            "id",
            "title",
            "description",
            "image",
            "release_date",
            "price",
            "author",
            "number_reviews",
            "rating",
        )


class ReviewSerializer(serializers.ModelSerializer):
    author_review = UserSerializer(many=False, read_only=True)
    book = BookSerializer(many=False, read_only=True)

    class Meta:
        model = Review
        fields = (
            "id",
            "author_review",
            "text",
            "book",
            "score",
        )

    def validate(self, data):
        book = get_object_or_404(Book, id=self.context["view"].kwargs.get("book_id"))

        if book.book_review.filter(
            author_review_id=self.context["request"].user.id
        ).exists():
            raise serializers.ValidationError("Вы уже оставили отзыв на эту книгу!")
        return data


class FavoriteSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source="book.title", read_only=True)
    image = serializers.SerializerMethodField(
        "get_image_url",
        read_only=True,
    )
    author = serializers.CharField(source="book.author", read_only=True)
    price = serializers.CharField(source="book.price", read_only=True)

    class Meta:
        model = Favourites
        fields = (
            "id",
            "title",
            "image",
            "author",
            "price",
        )

    def get_image_url(self, obj):
        if obj.book.image:
            # return f'https://{os.getenv("DOMAIN")}{obj.book.image.url}'
            return f"https://DOMAIN.ru/{obj.book.image.url}"
        return None

    def validate(self, data):
        book = get_object_or_404(Book, id=self.context["view"].kwargs.get("book_id"))

        if book.favourites_book.filter(
            user__id=self.context["request"].user.id
        ).exists():
            raise serializers.ValidationError("Данная книга уже добавлена в избранное!")
        return data


class ShoppingListSerializer(FavoriteSerializer):
    class Meta(FavoriteSerializer.Meta):
        model = ShoppingList

    def validate(self, data):
        book = get_object_or_404(Book, id=self.context["view"].kwargs.get("book_id"))

        if book.shoppinglist_book.filter(
            user__id=self.context["request"].user.id
        ).exists():
            raise serializers.ValidationError("Данная книга уже добавлена в корзину!")
        return data
