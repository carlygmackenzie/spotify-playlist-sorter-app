"""
File: login_services.py
Author: Carly MacKenzie
Description: Contains all worker functions related to login and setup
"""

import requests
from flask import current_app, request, session

REDIRECT_URI = "http://localhost:5000/callback"
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"

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
    
    # TODO: error handling
    session['access_token'] = response.json().get("access_token")
    session['refresh_token'] = response.json().get("refresh_token")

