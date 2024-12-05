import base64

from dotenv import load_dotenv

from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from users.serializers import UserSerializer
from .models import MAXIMUM_SCORE, MINIMUM_SCORE, Author, Book, Review

load_dotenv(override=True)


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
            "last_name",
            "first_name",
            "middle_name",
        )


class BookSerializer(serializers.ModelSerializer):
    image = Base64ImageField()
    author = AuthorSerializer(many=True, read_only=True)
    rating = serializers.DecimalField(
        read_only=True,
        max_digits=10,
        decimal_places=2,
        min_value=MINIMUM_SCORE,
        max_value=MAXIMUM_SCORE,
    )
    number_reviews = serializers.IntegerField(read_only=True)
    release_date = serializers.DateField(format="%d.%m.%Y")
    is_favorite = serializers.SerializerMethodField()
    is_shopping_list = serializers.SerializerMethodField()

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
            "is_favorite",
            "is_shopping_list",
        )

    def get_is_favorite(self, obj) -> bool:
        user = self.context["request"].user
        if user.is_authenticated:
            return (
                user.favorites_books.prefetch_related("favorites")
                .filter(id=obj.id)
                .exists()
            )
        return False

    def get_is_shopping_list(self, obj) -> bool:
        return (
            obj.shoppinglist_book.prefetch_related("book")
            .filter(user__id=self.context["request"].user.id)
            .exists()
        )


class ReviewSerializer(serializers.ModelSerializer):
    author_review = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Review
        fields = (
            "id",
            "author_review",
            "text",
            "score",
        )

    def validate(self, data):
        book = get_object_or_404(Book, id=self.context["view"].kwargs.get("book_id"))
        if (
            book.book_review.select_related("book")
            .filter(author_review_id=self.context["request"].user.id)
            .exists()
            and self.context["request"].method != "PUT"
        ):
            raise serializers.ValidationError("Вы уже оставили отзыв на эту книгу!")
        return data
