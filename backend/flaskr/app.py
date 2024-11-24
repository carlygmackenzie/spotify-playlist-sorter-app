from flask import Flask
from backend.flaskr.routes import bp
from dotenv import load_dotenv
import os
import secrets

# load environment variables from .env file
load_dotenv()

app = Flask(__name__)

app.secret_key = secrets.token_hex(16)
app.config['SESSION_COOKIE_SECURE'] = True

# retrieve environment variables
app.config['CLIENT_ID'] = os.getenv('SPOTIFY_CLIENT_ID')
app.config['CLIENT_SECRET'] = os.getenv('SPOTIFY_CLIENT_SECRET')

app.register_blueprint(bp)

if __name__ == "__main__":
    app.run(debug=True)

