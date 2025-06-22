from django.urls import path
from . import views

urlpatterns = [
    path('get-auth-url', views.AuthURL.as_view(), name='get-auth-url'),
    # path('redirect', views.AuthCallback.as_view(), name='redirect'),
    path('redirect', views.spotify_callback, name='redirect'),
    path('is-authenticated', views.IsAuthenticated.as_view(), name='is-authenticated'),
    path('current-song', views.CurrentSong.as_view(), name='current-song'),
    path('pause', views.PauseSong.as_view(), name='pause-song'),
    # path('play', views.PlaySong.as_view(), name='play-song'),
]
