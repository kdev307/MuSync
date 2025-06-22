from django.shortcuts import render
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .utils import *
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect
from api.models import Room
from .models import Vote

# Create your views here.

class AuthURL(APIView):
    def get(self, request, format=None): 
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming'
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
        }).prepare().url
        print("🔗 Spotify Auth URL:", url)

        return Response({'url': url}, status=status.HTTP_200_OK)
    

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')
    if error or not code:
        # return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        return redirect('http://localhost:3000/')
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    print("SPOTIFY CALLBACK HIT")
    print("Code:", request.GET.get("code"))
    print("Error:", request.GET.get("error"))
    print("REDIRECT_URI:", REDIRECT_URI)


    access_token = response.get('access_token')
    refresh_token = response.get('refresh_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    
    if not request.session.exists(request.session.session_key):
        request.session.create()

    print("SESSION ID (spotify_callback):", request.session.session_key)
    print("ROOM CODE (callback):", request.GET.get("state"))

    update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)
    room_code = request.GET.get('state')
    return redirect(f'http://localhost:3000/room/{room_code}')

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        print(f"Session key: {request.session.session_key}")
        print(f"Room code in session: {request.session.get('room_code')}")

        room_code = request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)
        # print(response)
        if 'error' in response or 'item' not in response:
            return Response({'message':'Cannot fetch the currently playing song'}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album = item.get('album').get('name')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        votes = len(Vote.objects.filter(room=room, song_id=song_id))
        
        song = {
            'title': item.get('name'),
            'album': album,
            'artists': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }

        self.update_room_song(room, song_id)

        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        current_song = room.current_song

        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=room).delete()
            print(f"Updated current song in room {room.code} to {song_id}")

class PauseSong(APIView):
    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code).first()
        if self.request.session.session_key == room.host or room.guest_can_pause:
            result = pause_song(room.host)
            if 'error' in result:
                error_info = result['error']
                if error_info.get('status') == 403 and error_info.get('reason') == 'PREMIUM_REQUIRED':
                    return Response(
                        {'message': 'Spotify Premium subscription is required to control playback.'},
                        status=status.HTTP_403_FORBIDDEN
                    )
            return Response({'message': 'Song Paused'},status=status.HTTP_204_NO_CONTENT)
        return Response({'message': 'You are not allowed to pause the song'}, status=status.HTTP_403_FORBIDDEN)
class PlaySong(APIView):
    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            result = play_song(room.host)
            if 'error' in result:
                error_info = result['error']
                if error_info.get('status') == 403 and error_info.get('reason') == 'PREMIUM_REQUIRED':
                    return Response(
                        {'message': 'Spotify Premium subscription is required to control playback.'},
                        status=status.HTTP_403_FORBIDDEN
                    )
            return Response({'message':'Song Played'},status=status.HTTP_204_NO_CONTENT)
        return Response({'message': 'You are not allowed to pause the song'}, status=status.HTTP_403_FORBIDDEN)

class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code).first()
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip
        
        if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
            votes.delete()
            result = skip_song(room.host)
            print("Skip song result:", result)
        else:
            vote = Vote(user=self.request.session.session_key, room=room, song_id=room.current_song)
            vote.save()
        return Response({'message': 'Song skipped'}, status=status.HTTP_204_NO_CONTENT)
