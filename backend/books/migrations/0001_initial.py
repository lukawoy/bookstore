# Generated by Django 5.1.2 on 2024-12-05 20:26

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Author",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("first_name", models.CharField(max_length=256, verbose_name="Имя")),
                ("last_name", models.CharField(max_length=256, verbose_name="Фамилия")),
                (
                    "middle_name",
                    models.CharField(
                        blank=True, max_length=256, verbose_name="Отчество"
                    ),
                ),
            ],
            options={
                "verbose_name": "Автор",
                "verbose_name_plural": "авторы",
                "ordering": ["-last_name"],
            },
        ),
        migrations.CreateModel(
            name="AuthorBook",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "author",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="authors",
                        to="books.author",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Book",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=256, verbose_name="Название")),
                ("description", models.TextField(verbose_name="Краткое описание")),
                (
                    "image",
                    models.ImageField(
                        default=None,
                        upload_to="books/images/",
                        verbose_name="Вид книги",
                    ),
                ),
                ("release_date", models.DateField(verbose_name="Дата выхода")),
                (
                    "price",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=8,
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(999999),
                        ],
                        verbose_name="Цена",
                    ),
                ),
                (
                    "author",
                    models.ManyToManyField(
                        through="books.AuthorBook",
                        to="books.author",
                        verbose_name="Автор",
                    ),
                ),
                (
                    "favorites",
                    models.ManyToManyField(
                        blank=True,
                        related_name="favorites_books",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Избранное",
                    ),
                ),
            ],
            options={
                "verbose_name": "Книга",
                "verbose_name_plural": "книги",
                "ordering": ["-title"],
            },
        ),
        migrations.AddField(
            model_name="authorbook",
            name="book",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="books",
                to="books.book",
            ),
        ),
        migrations.CreateModel(
            name="ShoppingList",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "book",
                    models.ManyToManyField(
                        blank=True,
                        related_name="shoppinglist_book",
                        to="books.book",
                        verbose_name="Книга",
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="shoppinglist_user",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Пользователь",
                    ),
                ),
            ],
            options={
                "verbose_name": "список покупок",
                "verbose_name_plural": "Списки покупок",
                "ordering": ["-user"],
            },
        ),
        migrations.CreateModel(
            name="Review",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("text", models.TextField(verbose_name="Текст отзыва")),
                (
                    "score",
                    models.IntegerField(
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(5),
                        ],
                        verbose_name="Оценка",
                    ),
                ),
                (
                    "author_review",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="author_review_book",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Автор отзыва",
                    ),
                ),
                (
                    "book",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="book_review",
                        to="books.book",
                        verbose_name="Книга",
                    ),
                ),
            ],
            options={
                "verbose_name": "Отзыв",
                "verbose_name_plural": "отзывы",
                "constraints": [
                    models.UniqueConstraint(
                        fields=("book", "author_review"), name="unique_review"
                    )
                ],
            },
        ),
    ]
