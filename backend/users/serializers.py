from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
        )
