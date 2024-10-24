from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Author(models.Model):
    first_name = models.CharField("Имя", max_length=256)
    last_name = models.CharField("Фамилия", max_length=256)
    middle_name = models.CharField("Отчество", max_length=256, blank=True)

    class Meta:
        verbose_name = "Автор"
        verbose_name_plural = "авторы"
        ordering = ["-last_name"]

    def __str__(self):  # ------------------- Сделать лучше!
        if not self.middle_name:
            return f"{self.last_name} {self.first_name[0]}."

        return f"{self.last_name} {self.first_name[0]}.{self.middle_name[0]}."


class Book(models.Model):
    title = models.CharField("Название", max_length=256)
    description = models.TextField("Краткое описание")
    image = models.ImageField("Вид книги", upload_to="books/images/", default=None)
    release_date = models.DateField("Дата выхода")
    price = models.IntegerField(
        "Цена",
        validators=[
            # в settings добавить значения
            MinValueValidator(1),
            MaxValueValidator(10000),
        ],
    )
    author = models.ManyToManyField(Author, verbose_name="Автор", through="AuthorBook")

    class Meta:
        verbose_name = "Книга"
        verbose_name_plural = "книги"
        ordering = ["-title"]

    def __str__(self):
        return self.title


class AuthorBook(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="books")
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="authors")


class Favourites(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Пользователь",
        related_name="favourites_user",
    )
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        verbose_name="Книга",
        related_name="favourites_book",
    )

    class Meta:
        verbose_name = "Избранное"
        verbose_name_plural = "избранное"
        ordering = ["-user"]

    def __str__(self):
        return f"{self.book.title} - {self.user.username}"


class ShoppingList(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Пользователь",
        related_name="shoppinglist_user",
    )
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        verbose_name="Книга",
        related_name="shoppinglist_book",
    )

    class Meta:
        verbose_name = "список покупок"
        verbose_name_plural = "Списки покупок"
        ordering = ["-user"]

    def __str__(self):
        return f"{self.book.title} - {self.user.username}"


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
            # Значения в settings
            MinValueValidator(1),
            MaxValueValidator(10),
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
        return f"Отзыв {self.author_review.username} на книгу {self.book.title}"
