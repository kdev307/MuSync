from django.db import models

# Create your models here.

class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_in = models.DateTimeField()
    refresh_token = models.CharField(max_length=512)
    access_token = models.CharField(max_length=512)
    token_type = models.CharField(max_length=50)