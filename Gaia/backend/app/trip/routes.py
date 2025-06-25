import json
import os
import re
import traceback

import requests
from app.extensions import mongo
from app.trip import bp
from bson import ObjectId  # To help with ObjectId conversion
from flask import Flask, current_app, jsonify, logging, request
from google import genai

from .ai_module import (generate_prompt, generate_query_for_hobby,
                        save_plan_mongo)
from .new_trip_creation import (save_end, save_group, save_interests,
                                save_location, save_start)
from .scraper import scrape_municipality_open_data

# Google Places API base URL and key from the environment
GOOGLE_PLACES_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def convert_objectids(obj):
    """
    Recursively converts any ObjectId instances in the given object (dict or list)
    into strings so that they can be JSON serialized.
    """
    if isinstance(obj, list):
        return [convert_objectids(item) for item in obj]
    elif isinstance(obj, dict):
        new_obj = {}
        for key, value in obj.items():
            if isinstance(value, ObjectId):
                new_obj[key] = str(value)
            else:
                new_obj[key] = convert_objectids(value)
        return new_obj
    else:
        return obj

@bp.route('submitFormData/', methods=['POST'])
def submitFormData():
    data = request.json
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    db = mongo.get_db("Users")
    trips_collection = db.get_collection("planned_trips")
    data["user_id"] = user_id
    insert_result = trips_collection.insert_one(data)
    return jsonify({"message": "Form submitted successfully", "inserted_id": str(insert_result.inserted_id)}), 200

@bp.route('delete/', methods=['POST'])
def deleteTrip():
    db = mongo.get_db("Users")
    trips_collection = db.get_collection("planned_trips")
    user_id = request.json.get('user_id')
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    result = trips_collection.delete_many({"user_id": user_id})
    if result.deleted_count > 0:
        return jsonify({"message": "trip deleted for user {user_id}"}), 200
    else:
         return jsonify({"message": "no trips for user {user_id}"}), 200

@bp.route('askAgent/', methods=['POST'])
def askAgent():   
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        # db = mongo.get_db("Users")
        # plans_collection = db.get_collection("plans")

        prompt = generate_prompt(data)
        # print (prompt)

        client = genai.Client(api_key=GOOGLE_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )

        generated_text = response.text
        plan_id = save_plan_mongo(generated_text, user_id)

        # json_str = re.search(r'\{.*\}', generated_text, re.DOTALL).group()
        # plan = json.loads(json_str)
        # _id = ObjectId()
        # plan["_id"] = str(_id)
        # plans_collection.insert_one()


        return jsonify({"response": str(plan_id)}), 200
    except Exception as e:
        print("An error occurred in /askAgent route:")
        traceback.print_exc() 
        return jsonify({"error": str(e)}), 500

# # check if needed
@bp.route('newTrip/', methods=['POST'])
def newTrip():
    print("newTrip")
    # Expected input JSON example:
    # {
    #   "start_date": "2025-01-01",
    #   "end_date": "2025-01-05",
    #   "destination": "Berlin",
    #   "hobbies": ["museum", "cafes"]
    # }
    
    user_inputs = request.get_json()
    user_name = user_inputs.get("user_name")
    destination = user_inputs.get("destination")
    hobbies = user_inputs.get("hobbies", [])
    start_date = user_inputs.get("start_date")
    end_date = user_inputs.get("end_date")
    overwrite = user_inputs.get("overwrite", False)
    if not user_name or not destination or not start_date or not end_date:
        return jsonify({"error": "Destination, start_date, and end_date are required."}), 400

    # Step 1: For each hobby, generate a query using the AI module.
    api_results = {}
    db = current_app.db  # Access the database from the app context.
    for hobby in hobbies:
        query_str = generate_query_for_hobby(destination, hobby)
        # Prepare the parameters for the Google Places API.
        params = {
            "query": query_str,
            "key": GOOGLE_API_KEY
        }
        resp = requests.get(GOOGLE_PLACES_URL, params=params)
        if resp.status_code == 200:
            api_results[hobby] = resp.json().get("results", [])
        else:
            api_results[hobby] = []

    # Step 2: Retrieve or scrape municipality open data.
    """
    municipality_collection = db.get_collection("municipality_data")
    municipality_doc = municipality_collection.find_one({"city": destination.lower()})
    if municipality_doc:
        municipality_data = municipality_doc.get("data", [])
    else:
        scraped_data = scrape_municipality_open_data(destination)
        municipality_data = scraped_data.get("data", [])
        municipality_collection.insert_one({
            "city": destination.lower(),
            "data": municipality_data
        })
    """
    combined_result = {
        "user_name": user_name,
        "destination": destination.lower(),
        "trip_dates": {"start_date": start_date, "end_date": end_date},
        "api_results": api_results,
        #"municipality_data": municipality_data
    }

    combined_collection = db.get_collection("combined_data")
    existing_trip = combined_collection.find_one({
        "user_name": user_name,
        "destination": destination.lower(), 
    })
    print("existing_trip", existing_trip)

    if existing_trip:
        print("there is an existing trip")
        if not overwrite:
            # Return a 409 Conflict with a message and the existing data.
            existing_trip_clean = convert_objectids(existing_trip)
            return jsonify({
                "message": "Trip data already exists for this user and destination.",
                "existing_data": existing_trip_clean,
                "confirmOverwrite": True
            }), 409
        else:
            # Update the existing record with the new data.
            combined_collection.replace_one({"_id": existing_trip["_id"]}, combined_result)
            combined_result['_id'] = str(existing_trip["_id"])
            combined_result = convert_objectids(combined_result)
            return jsonify(combined_result), 200
    else:
        print("there is no existing trip")
        # Insert the new trip data.
        insert_result = combined_collection.insert_one(combined_result)
        combined_result['_id'] = str(insert_result.inserted_id)
        combined_result = convert_objectids(combined_result)
        return jsonify(combined_result), 200