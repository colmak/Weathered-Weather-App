from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save


# Create your models here.


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    profile_pic = models.ImageField(default='base.jpg', upload_to='profiles')
    location = models.CharField(max_length=200)
    about = models.TextField(max_length=200)

    def __str__(self):
        return self.user.username

    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    post_save.connect(create_user_profile, sender=User)
