"""
File: routes.py
Author: Carly MacKenzie
Description: Holds all endpoints and calls their worker functions
"""

from flask import Blueprint, current_app, redirect, request, url_for, session
import requests
from urllib.parse import urlencode
from src.flaskr.services import sort_playlist_services

bp = Blueprint('main', __name__)

REDIRECT_URI = "http://localhost:5000/callback"
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"

@bp.route('/')
def index():
    return "Welcome to the Spotify Playlist Sorter!"

@bp.route('/login')
def login():
    # redirect user to Spotify's authorization page
    scopes = [
        "playlist-modify-public",
        "playlist-modify-private"
    ]
    scope_string = " ".join(scopes)

    params = {
        "client_id": current_app.config['CLIENT_ID'],
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": scope_string
    }
    url = f"{AUTH_URL}?{urlencode(params)}"
    return redirect(url)

@bp.route('/callback', methods=["POST", "GET"])
def callback():
    # capture authorization code from callback request
    code = request.args.get("code")
    if not code:
        return "Error: No code returned."
    
    # exchange auth code for access token
    token_data = {
        "grant_type": "authorization_code",
        "code": code, 
        "redirect_uri": REDIRECT_URI,
        "client_id": current_app.config['CLIENT_ID'],
        "client_secret": current_app.config['CLIENT_SECRET']
    }

    response = requests.post(TOKEN_URL, data=token_data)
    
    ## error handling
    session['access_token'] = response.json().get("access_token")
    session['refresh_token'] = response.json().get("refresh_token")

    #return session.get('access_token')
    return redirect(url_for('main.index'))

@bp.route('/sort_playlist', methods=["PUT", "GET"])
def sort_playlist():
    sort_playlist_services.sort_playlist('2etcGlbBu5V1XMFi3gtOZ3', 4, True)
    return "Check your playlist to see the sorting magic!"
    



