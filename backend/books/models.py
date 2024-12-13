from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

MAXIMUM_PRICE = 999999
MINIMUM_PRICE = 1
MAXIMUM_SCORE = 5
MINIMUM_SCORE = 1


User = get_user_model()


class Author(models.Model):
    first_name = models.CharField("Имя", max_length=256)
    last_name = models.CharField("Фамилия", max_length=256, db_index=True)
    middle_name = models.CharField("Отчество", max_length=256, blank=True)

    class Meta:
        verbose_name = "Автор"
        verbose_name_plural = "авторы"
        ordering = ["-last_name"]

    def __str__(self):
        if not self.middle_name:
            return f"{self.last_name} {self.first_name[0]}."

        return f"{self.last_name} {self.first_name[0]}.{self.middle_name[0]}."


class Book(models.Model):
    title = models.CharField("Название", max_length=256, db_index=True)
    description = models.TextField("Краткое описание")
    image = models.ImageField("Вид книги", upload_to="books/images/", default=None)
    release_date = models.DateField("Дата выхода")
    price = models.DecimalField(
        "Цена",
        max_digits=8,
        decimal_places=2,
        validators=[
            MinValueValidator(MINIMUM_PRICE),
            MaxValueValidator(MAXIMUM_PRICE),
        ],
    )

    author = models.ManyToManyField(Author, verbose_name="Автор", through="AuthorBook")
    favorites = models.ManyToManyField(
        User, verbose_name="Избранное", related_name="favorites_books", blank=True
    )

    class Meta:
        verbose_name = "Книга"
        verbose_name_plural = "книги"
        ordering = ["-title"]

    def __str__(self):
        return self.title


class AuthorBook(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="books")
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="authors")


class ShoppingList(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        verbose_name="Пользователь",
        related_name="shoppinglist_user",
    )
    book = models.ManyToManyField(
        Book, verbose_name="Книга", related_name="shoppinglist_book", blank=True
    )

    class Meta:
        verbose_name = "список покупок"
        verbose_name_plural = "Списки покупок"
        ordering = ["-user"]

    def __str__(self):
        return f"Корзина ID {self.id}"


class Review(models.Model):
    author_review = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Автор отзыва",
        related_name="author_review_book",
    )
    text = models.TextField("Текст отзыва")
    book = models.ForeignKey(
        Book, on_delete=models.CASCADE, verbose_name="Книга", related_name="book_review"
    )
    score = models.IntegerField(
        "Оценка",
        validators=[
            MinValueValidator(MINIMUM_SCORE),
            MaxValueValidator(MAXIMUM_SCORE),
        ],
    )

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "отзывы"
        constraints = [
            models.UniqueConstraint(
                fields=["book", "author_review"], name="unique_review"
            ),
        ]

    def __str__(self):
        return f"Отзыв ID {self.id}. {self.text[:20]}..."
