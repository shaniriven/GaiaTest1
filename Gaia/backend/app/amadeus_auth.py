import requests
import time
from backend.config import AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET

# Sandbox auth URL
AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token"

# We'll store the token and expiry time in module-level variables
ACCESS_TOKEN = None
TOKEN_EXPIRY = 0

def get_access_token():
    """
    Returns a valid access token. If the current token is expired or missing,
    it fetches a new one from Amadeus.
    """
    global ACCESS_TOKEN, TOKEN_EXPIRY

    # Check if we already have a valid token
    if ACCESS_TOKEN and time.time() < TOKEN_EXPIRY:
        return ACCESS_TOKEN
    
    # Otherwise, request a new token
    payload = {
        'grant_type': 'client_credentials',
        'client_id': AMADEUS_CLIENT_ID,
        'client_secret': AMADEUS_CLIENT_SECRET,
    }
    response = requests.post(AUTH_URL, data=payload)
    if response.status_code == 200:
        data = response.json()
        ACCESS_TOKEN = data['access_token']
        # Subtract a few seconds from expires_in to avoid edge cases
        TOKEN_EXPIRY = time.time() + data['expires_in'] - 10
        return ACCESS_TOKEN
    else:
        raise Exception(f"Error obtaining access token: {response.text}")


def get_points_of_interest(latitude, longitude):
    """
    Example function to get Points of Interest from Amadeus.
    """
    token = get_access_token()
    headers = {"Authorization": f"Bearer {token}"}
    url = (
        f"https://test.api.amadeus.com/v1/reference-data/locations/pois?"
        f"latitude={latitude}&longitude={longitude}"
    )
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error fetching POI data: {response.text}")
