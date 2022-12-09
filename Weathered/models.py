from django.db import models

REACTION = (
    ('Smile', 'Smile'),
    ('Neutral', 'Neutral'),
    ('Sad', 'Sad'),
)


class Reaction(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=200)
    reaction = models.CharField(max_length=20, blank=True, choices=REACTION)

    def __str__(self):
        return self.reaction


class Weather(models.Model):
    location = models.CharField(max_length=200)
