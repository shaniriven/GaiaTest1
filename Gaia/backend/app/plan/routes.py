
import base64
import os
import uuid
from datetime import datetime
from io import BytesIO

import requests
from app.extensions import mongo
from app.plan import bp
from bson.binary import Binary
from dotenv import load_dotenv
from flask import current_app, jsonify, request
from PIL import Image

from .manipulate import generate_dates_list

# from openai import OpenAI


load_dotenv()
# openai.api_key = os.getenv("OPENAI_API_KEY")

@bp.route('fetchActivitiesImages/', methods=['POST'])
def fetchActivitiesImages():
    try:
        data = request.get_json()
        activities = data.get("daily_plan_activities", [])
        if not activities:
            return jsonify({"error": "Missing daily_plan_activities parameter"}), 400

        # Save to MongoDB
        db = mongo.get_db("GaiaDB") 
        images_collection = db.get_collection("images")

        for activity in activities:
            prompt = activity.get("title")
            if not prompt:
                return jsonify({"error": "Missing prompt"}), 400
            
            existing_image_doc = images_collection.find_one({"prompt": prompt})
            if existing_image_doc:
                image_data_bytes = existing_image_doc["image"]
                base64_image_str = base64.b64encode(image_data_bytes).decode('utf-8')
            else:
                formatted_prompt = prompt.replace(" ", "-")
                print('\nformatted_prompt: ', formatted_prompt, "\n")
                url = f"https://image.pollinations.ai/prompt/{formatted_prompt}"
                response = requests.get(url)
                if response.status_code != 200:
                    return jsonify({"error": "Failed to generate image"}), 500
                image_doc = {
                    "prompt": prompt,
                    "image": response.content
                }
                images_collection.insert_one(image_doc)
                base64_image_str = base64.b64encode(response.content).decode('utf-8')
            activity["image"] = base64_image_str
        print(activities)
        return jsonify({
            "updatedActivities": activities,
         }), 200

    except Exception as e:
        print("Error fetching plans fetchActivitiesImages:", e)
        return jsonify({"error": "Internal Server Error"}), 500

@bp.route('fetchPlanData/', methods=['GET'])
def fetchPlanData():
    plan_id = request.args.get("plan_id")
    if not plan_id:
        return jsonify({"error": "Missing plan_id parameter"}), 400
    try:
        db = mongo.get_db("Users")
        plans_collection = db.get_collection("plans")
        plan = plans_collection.find_one({"_id": plan_id})
        if not plan:
            return jsonify({"error": "Plan not found"}), 404
        plan["_id"] = str(plan["_id"])
        plan["id"] = plan.pop("_id")
        plans_list = generate_dates_list(plan["trip_dates"], plan["itinerary"])
        dates_list = [{"day": item["day"], "value": item["value"]} for item in plans_list]
        return jsonify({
            "plan": plan,
            "datesList": dates_list,
            "generatedPlansList": plans_list
        }), 200
    except Exception as e:
        print("Error fetching plans:", e)
        return jsonify({"error": "Internal Server Error"}), 500