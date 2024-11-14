from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser
from django.core import validators
from django.db import models


class User(AbstractUser):
    username = models.CharField(
        "Логин",
        unique=True,
        db_index=True,
        max_length=150,
        validators=[validators.RegexValidator(r"^[\w.@+-]+\Z")],
    )
    email = models.EmailField("Адрес электронной почты", unique=True, max_length=254)
    first_name = models.CharField("Имя", max_length=150)
    last_name = models.CharField("Фамилия", max_length=150)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith("pbkdf2_sha256$"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
