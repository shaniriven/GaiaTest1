from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime
import os
from bson import ObjectId

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.Users  # Or specify like: client["your-db-name"]

saved_chats_bp = Blueprint("saved_chats", __name__)

@saved_chats_bp.route("/save_chat", methods=["POST"])
def save_full_chat():
    data = request.json
    user_id = data.get("user_id")
    trip_id = data.get("trip_id")
    conversation = data.get("conversation")

    if not all([user_id, conversation]):
        return jsonify({"error": "Missing required fields"}), 400

    chat_doc = {
        "user_id": user_id,
        "trip_id": trip_id,
        "timestamp": datetime.utcnow(),
        "conversation": conversation,
    }

    db.saved_chats.insert_one(chat_doc)
    return jsonify({"status": "chat saved"}), 200


@saved_chats_bp.route("/get_chats/<user_id>", methods=["GET"])
def get_chats(user_id):
    try:
        chats = list(db.saved_chats.find({"user_id": user_id}))
        for chat in chats:
            chat['_id'] = str(chat['_id'])  # Convert ObjectId to string
        return jsonify(chats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@saved_chats_bp.route("/delete_chat/<chat_id>", methods=["DELETE"])
def delete_chat(chat_id):
    try:
        result = db.saved_chats.delete_one({"_id": ObjectId(chat_id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Chat deleted successfully."})
        else:
            return jsonify({"error": "Chat not found."}), 404
    except Exception as e:
        print("❌ Delete error:", e)
        return jsonify({"error": str(e)}), 500
