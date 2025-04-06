import environ
from django.conf import settings

env = environ.Env()
env.read_env(settings.BASE_DIR / '.env')

CLIENT_ID= env('SPOTIFY_CLIENT_ID')
CLIENT_SECRET= env('SPOTIFY_CLIENT_SECRET')
REDIRECT_URI= env('SPOTIFY_REDIRECT_URI')