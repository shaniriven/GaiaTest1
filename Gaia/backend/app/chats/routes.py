from flask import Blueprint, request, jsonify
import os
from dotenv import load_dotenv
import google.generativeai as genai
from pymongo import MongoClient

load_dotenv()

chat_bp = Blueprint("chat_bp", __name__)
genai.configure(api_key=os.getenv("GEMINI_API_KEY_CHATS"))

model = genai.GenerativeModel("gemini-2.5-flash")
chat_session = model.start_chat(history=[])

mongo_uri = os.getenv("MONGO_URI")
mongo = MongoClient(mongo_uri)
plans_collection = mongo["Users"]["plans"]

@chat_bp.route("/chat/send", methods=["POST"])
def chat_with_gemini():
    try:
        user_input = request.json.get("message", "")
        use_trips = request.json.get("useTrips", False)
        user_id = request.json.get("user_id", "")

        if not user_input:
            return jsonify({"error": "Empty message"}), 400
        if not user_id:
            return jsonify({"error": "Missing user_id"}), 400
        if "Check my trip plan" in user_input:
            use_trips = True
        initial_prompt = "Hi, what can I help you with?"
        trip_context = ""

        if use_trips:
            user_trips = list(plans_collection.find({"creator": user_id}))
            if user_trips:
                formatted = [
                    f"- {trip.get('name', '')} in {trip.get('locations', '')} during {trip.get('formatted_date', '')}"
                    for trip in user_trips
                ]
                trip_context = "The user has the following trips planned:\n" + "\n".join(formatted)
                print("📦 Trip Context:\n", trip_context)
                chat_session.send_message(trip_context)

        response = chat_session.send_message(user_input)

        if len(chat_session.history) <= 2:
            reply = initial_prompt
        else:
            reply = response.text

        print("✅ Gemini Reply:", reply)
        return jsonify({"response": reply})

    except Exception as e:
        print("❌ Gemini Error:", e)
        return jsonify({"error": str(e)}), 500




@chat_bp.route("/chat/init", methods=["GET"])
def init_chat():
    try:
        use_trips = request.args.get("useTrips", "false").lower() == "true"
        user_id = request.args.get("userId")

        if not user_id:
            return jsonify({"error": "Missing userId"}), 400

        print(f"🚀 Chat init called | useTrips={use_trips}, user={user_id}")

        trip_context = ""
        if use_trips:
            user_trips = list(plans_collection.find({"creator": user_id}))
            print(f"📦 Found {len(user_trips)} trips")

            if user_trips:
                formatted = [
                    f"- {trip.get('name', '')} in {trip.get('locations', '')} during {trip.get('formatted_date', '')}"
                    for trip in user_trips
                ]
                trip_context = "The user has the following trips planned:\n" + "\n".join(formatted)
                chat_session.send_message(trip_context)
                print("📤 Sent trip context to Gemini")

        # Force initial message to begin conversation
        chat_session.send_message("Hello")

        return jsonify({"response": "Hi, what can I help you with?"})

    except Exception as e:
        print("❌ Init Chat Error:", e)
        return jsonify({"error": str(e)}), 500