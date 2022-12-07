from django.contrib.auth.models import User
from django.db import models


class Reaction(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    location = models.TextField(max_length=200)
    reaction = models.TextField(max_length=20)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.reaction


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    avatar = models.ImageField(default='default.jpg', upload_to='profile_images')
    location = models.CharField(max_length=200)
    bio = models.TextField(max_length=200)

    def __str__(self):
        return self.user.username


class Weather(models.Model):
    location = models.CharField(max_length=200)
