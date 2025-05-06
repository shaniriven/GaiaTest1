
from flask import jsonify
from bson.objectid import ObjectId
from datetime import datetime

def save_location(trips_collection, data, open_trip): 
    location_data = data.get("fieldData",{}).get("location",[])

    if not open_trip:
        new_trip = {
            "user_id": data.get("user_id"),
            "location": location_data,  
        }
        trips_collection.insert_one(new_trip)
    else:
        updated_trip = {
            "$set": {
                "location": location_data 
            }
        }
        trips_collection.update_one({"_id": open_trip["_id"]}, updated_trip)
    return jsonify({"message": "Trip updated successfully!"}), 200


def save_start(trips_collection, data, open_trip): 
    start_date_str  = data.get("fieldData",{}).get("start",None)
    if start_date_str :
        start_date = datetime.strptime(start_date_str, "%Y-%m-%dT%H:%M:%S.%fZ")  # Convert ISO string to datetime
    else:
        start_date = None

    if not open_trip:
        new_trip = {
            "user_id": data.get("user_id"),
            "start": start_date,  
        }
        trips_collection.insert_one(new_trip)
    else:
        trips_collection.update_one(
            {"_id": open_trip["_id"]},
            {"$set": {"start": start_date}}
        )
    return jsonify({"message": "Trip updated successfully!"}), 200

def save_end(trips_collection, data, open_trip): 
    end_date_str  = data.get("fieldData",{}).get("end",None)
    if end_date_str :
        end_date = datetime.strptime(end_date_str, "%Y-%m-%dT%H:%M:%S.%fZ")  # Convert ISO string to datetime
    else:
        end_date = None

    if not open_trip:
        new_trip = {
            "user_id": data.get("user_id"),
            "end": end_date,  
        }
        trips_collection.insert_one(new_trip)
    else:
        trips_collection.update_one(
            {"_id": open_trip["_id"]},
            {"$set": {"end": end_date}}
        )
    return jsonify({"message": "Trip updated successfully!"}), 200

def save_group(trips_collection, data, open_trip): 
    group_data = data.get("fieldData",{}).get("group",[])

    if not open_trip:
        new_trip = {
            "user_id": data.get("user_id"),
            "group": group_data,  
        }
        trips_collection.insert_one(new_trip)
    else:
        updated_trip = {
            "$set": {
                "group": group_data 
            }
        }
        trips_collection.update_one({"_id": open_trip["_id"]}, updated_trip)
    return jsonify({"message": "Trip updated successfully!"}), 200

def save_interests(trips_collection, data, open_trip): 
    interests_data = data.get("fieldData",{}).get("interests",[])

    if not open_trip:
        new_trip = {
            "user_id": data.get("user_id"),
            "interests": interests_data,  
        }
        trips_collection.insert_one(new_trip)
    else:
        updated_trip = {
            "$set": {
                "interests": interests_data 
            }
        }
        trips_collection.update_one({"_id": open_trip["_id"]}, updated_trip)
    return jsonify({"message": "Trip updated successfully!"}), 200