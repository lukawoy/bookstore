# Generated by Django 3.2.3 on 2024-10-23 19:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("books", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="review",
            name="author_review",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="author_review_book",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Автор отзыва",
            ),
        ),
    ]
