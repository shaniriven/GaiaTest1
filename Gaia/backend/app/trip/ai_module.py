# backend/app/main/ai_module.py

import os
import json
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_query_for_hobby(destination: str, hobby: str) -> str:
    """
    Uses OpenAI's API to generate a query string to send to the Google Places API.
    For example, if destination is 'Berlin' and hobby is 'museums', the function might return:
    "Give me the 10 most ranked museums in Berlin"
    """
    prompt = (
        f"Generate a query for the Google Places API for a user interested in {hobby} in {destination}. "
        "The query should ask for the 10 most highly ranked places related to that interest in that destination. "
        "Return only the query string without any additional text."
    )
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # or use gpt-4 if available
            messages=[
                {"role": "system", "content": "You are an assistant that generates query strings for the Google Places API."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            max_tokens=50,
        )
        query = response["choices"][0]["message"]["content"].strip()
        return query
    except Exception as e:
        print("Error calling OpenAI API:", e)
        # Fallback query in case of error
        return f"10 most ranked {hobby} in {destination}"
