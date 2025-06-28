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
        db = mongo.get_db("Users")
        plans_collection = db.get_collection("plans")
        plans = list(plans_collection.find({"creator": user_id}))
        plans_labels = []

        for plan in plans:
            plans_labels.append({
                "_id": str(plan["_id"]),
                "name": plan["name"],
                "formatted_date": plan["formatted_date"]
            })

        return jsonify(plans_labels), 200
    except Exception as e:
        print("Error fetching plans:", e)
        return jsonify({"error": "Internal Server Error"}), 500
