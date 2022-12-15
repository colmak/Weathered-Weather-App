from django.contrib.auth.models import User
from django.db import models

REACTION = (
    ('Happy', 'Happy'),
    ('Sad', 'Sad'),
)


class Reaction(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    reaction = models.CharField(max_length=20, blank=True, choices=REACTION)
    user = models.ManyToManyField(User)
    location = models.CharField(max_length=200)
    temp = models.TextField(max_length=200)
    condition = models.CharField(max_length=50)

    def __str__(self):
        return self.reaction
