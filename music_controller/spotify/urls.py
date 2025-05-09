from django.urls import path
from . import views

urlpatterns = [
    path('get-auth-url', views.AuthURL.as_view(), name='get-auth-url'),
    # path('redirect', views.AuthCallback.as_view(), name='redirect'),
    path('redirect', views.spotify_callback, name='redirect'),
    path('is-authenticated', views.IsAuthenticated.as_view(), name='is-authenticated'),
]
