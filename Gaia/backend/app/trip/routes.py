from app.trip import bp
from app.extensions import mongo
from flask import jsonify, logging, request, Flask
import os
import json
import requests
from flask import request, jsonify, current_app
from bson import ObjectId  # To help with ObjectId conversion
from .ai_module import generate_query_for_hobby
from .scraper import scrape_municipality_open_data
from .new_trip_creation import save_location, save_start, save_end, save_group, save_interests
from google import genai

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

@bp.route('submitForm/', methods=['POST'])
def submitForm():
    print("submitField")
    data = request.json
    user_id = data.get("user_id")
    print("user id:", user_id)
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    db = mongo.get_db("Users")
    trips_collection = db.get_collection("planned_trips")
    data["user_id"] = user_id
    insert_result = trips_collection.insert_one(data)
    return jsonify({"message": "Form submitted successfully", "inserted_id": str(insert_result.inserted_id)}), 200

@bp.route('submit/<string:fieldName>/', methods=['POST'])
def submitField(fieldName): 
    print("submitField")
    data = request.json
    db = mongo.get_db("Users")
    trips_collection = db.get_collection("planned_trips")
    open_trip = trips_collection.find_one({"user_id": data.get("user_id")})
    if fieldName == "startDate":
        data["type"] = "startDate"
    elif fieldName == "end":
        data["type"] = "end"
        
    handlers = {
        'location': save_location,
        'start': save_start,
        'end': save_end,
        'group': save_group,
        'interests': save_interests,
    }

    if fieldName in handlers:
        return handlers[fieldName](trips_collection, data, open_trip)
    
    return jsonify({"error": "Invalid field name"}), 400

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
    data = request.get_json()
    start = data.get("start")
    end = data.get("end")
    # location = ", ".join(data.get("location", []))
    location = data.get("location")
    # Map location to name for better readability in the prompt
    print(location)
    group_type = data.get("groupType")
    adults = data.get("adults")
    children = data.get("children")
    interests = ", ".join(data.get("interestsList", []))
    include_restaurants = data.get("includeRestaurants")
    include_flights = data.get("includeFlights")
    try:
        prompt = f"""
        Plan a trip for the following details:

        - Dates: {start} to {end}
        - Destination(s): {location}
        - Group Type: {group_type}
        - Number of Adults: {adults}
        - Number of Children: {children}
        - Interests: {interests}
        - Include Restaurants: {include_restaurants}
        - Include Flights: {include_flights}

        Generate a day-by-day itinerary with activities, food suggestions, and any travel tips. 
        Include estimated daily costs if possible.
        """

        client = genai.Client(api_key=GOOGLE_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        print(response.text)
        return jsonify({"response": response.text}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# check if needed
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