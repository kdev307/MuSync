from django.urls import path
from . import views

urlpatterns = [
    path('room', views.RoomView.as_view(), name='room'),
    path('create-room', views.CreateRoomView.as_view(), name='create-room'),
    path('get-room',views.GetRoom.as_view(), name='get-room-data'),
    path('join-room', views.JoinRoom.as_view(), name='join-room'),
    path('user-in-room', views.UserInRoom.as_view(), name='user-in-room'),
    path('leave-room', views.LeaveRoom.as_view(), name='leave-room'),
    path('update-room', views.UpdateRoom.as_view(), name='update-room'),
]
