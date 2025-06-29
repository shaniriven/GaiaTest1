
import os

import openai
from app.extensions import mongo
from app.plan import bp
from dotenv import load_dotenv
from flask import current_app, jsonify, request

from .manipulate import generate_dates_list

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

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

        print("itinerar: ", plan["itinerary"])
        plans_list = generate_dates_list(plan["trip_dates"], plan["itinerary"])
        dates_list = [{"day": item["day"], "value": item["value"]} for item in plans_list]
        print("\nplan_data: \n", plans_list)
        print("\ndates_list: \n", dates_list)
        return jsonify({
            "plan": plan,
            "datesList": dates_list,
            "generatedPlansList": plans_list
        }), 200
    except Exception as e:
        print("Error fetching plans:", e)
        return jsonify({"error": "Internal Server Error"}), 500