import base64
import json
import os
from datetime import datetime

import requests
from app.extensions import mongo
from app.home import bp
from bson import ObjectId
from flask import current_app, jsonify, request


@bp.route('fetchPlansData/', methods=['GET'])
def fetchPlansData():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id parameter"}), 400
    try:
        db = mongo.get_db("Users")
        plans_collection = db.get_collection("plans")
        plans = list(plans_collection.find({"creator": user_id}))
        for plan in plans:
            plan["_id"] = str(plan["_id"])
            itinerary = plan.get("itinerary", {})
            for day in itinerary.values():
                for activity in day.get("activities", []):
                    image = activity.get("image")
                    if isinstance(image, bytes):
                        activity["image"] = base64.b64encode(image).decode("utf-8")
    
        return jsonify(plans), 200
    except Exception as e:
        print("Error fetching plans:", e)
        return jsonify({"error": "Internal Server Error"}), 500


@bp.route('fetchPlansLabels/', methods=['GET'])
def fetchPlansLabels():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id parameter"}), 400
    try:
        # print("home/fetchPlansLabels 1:", user_id, "\n")
        db = mongo.get_db("Users")
        plans_collection = db.get_collection("plans")
        plans = list(plans_collection.find({"creator": user_id}))
        plans_labels = []
        # print("home/fetchPlansLabels 2\n")
        for plan in plans:
            plans_labels.append({
                "_id": str(plan["_id"]),
                "name": plan["name"],
                "formatted_date": plan["formatted_date"],
                "is_past": plan["is_past"]
            })
        # print("home/fetchPlansLabels 3\n")
        return jsonify(plans_labels), 200
    except Exception as e:
        print("Error fetching plans:", e)
        return jsonify({"error": "Internal Server Error"}), 500
