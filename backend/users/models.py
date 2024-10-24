from django.contrib.auth.models import AbstractUser
from django.core import validators
from django.db import models


class User(AbstractUser):

    def __str__(self):
        return self.username
