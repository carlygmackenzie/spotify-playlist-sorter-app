"""
File: routes.py
Author: Carly MacKenzie
Description: Holds all endpoints and calls their worker functions
"""

from flask import Blueprint, current_app, redirect, request, url_for, session, make_response
import requests
from urllib.parse import urlencode
from backend.flaskr.services import sort_playlist_services

bp = Blueprint('main', __name__)

REDIRECT_URI = "http://localhost:5000/callback"
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"

@bp.route('/*', methods=["OPTIONS"])
def handle_preflight():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "content-Type, X-Requested-With")
    response.headers.add("Access-Control-Allow-Methods", "POST", "GET", "PUT", "DELETE")
    response.headers.add("Access-Control-Allow-Credentials", "true")


@bp.route('/data')
def data():
    return {
        'message': "flask is working :)"
    }

# TODO: make this happen automatically
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
    return redirect(url_for('main.data'))

# TODO: add ascending/descending option for user
# TODO: return success/fail to frontend and handle accordingly
@bp.route('/sort-playlist', methods=["POST"])
def sort_playlist():

    data = request.get_json()
    playlist_id = data.get("playlistId")
    sorting_attr = data.get("sortingAttr")

    sort_playlist_services.sort_playlist(playlist_id, sorting_attr['id'], True)
    return "Check your playlist to see the sorting magic!"
    



