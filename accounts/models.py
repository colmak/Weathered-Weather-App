from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    profile_pic = models.ImageField(default='base.jpg', upload_to='profiles')
    location = models.CharField(max_length=200)
    about = models.TextField(max_length=200)

    def __str__(self):
        return self.user.username
