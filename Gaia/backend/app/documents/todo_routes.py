from flask import Blueprint, request, jsonify
from bson import ObjectId
from pymongo import MongoClient
import os

todo_bp = Blueprint('todo_routes', __name__)

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
todo_col = client.Users.todoLists
users_col =client.Users.users
plans_col = client.Users.plans

# Utility: get todoList document by trip_id and creator
def get_todo_doc(creator, trip_id):
    return todo_col.find_one({"creator": creator, "trip_id": trip_id})

# 1. Create new todo list
@todo_bp.route('/todo/create', methods=['POST'])
def create_todo_list():
    data = request.json
    creator = data.get("creator")
    trip_id = data.get("trip_id")
    task = data.get("task")

    if not (creator and trip_id and task):
        return jsonify({"error": "Missing required fields."}), 400

    existing = get_todo_doc(creator, trip_id)
    if existing:
        return jsonify({"error": "Todo list already exists for this trip."}), 400

    doc = {
        "creator": creator,
        "trip_id": trip_id,
        task: True
    }

    result = todo_col.insert_one(doc)
    todo_id = str(result.inserted_id)

    users_col.update_one(
        {"creator": creator},
        {"$addToSet": {"todos": todo_id}}
    )

    return jsonify({"message": "Todo list created.", "todo_id": todo_id})

# 2. Add task to existing todo list
@todo_bp.route('/todo/add_task', methods=['POST'])
def add_task():
    print("Incoming data:", request.json) 
    data = request.json
    creator = data.get("creator")
    trip_id = data.get("trip_id")
    task = data.get("task")

    if not (creator and trip_id and task):
        return jsonify({"error": "Missing required fields."}), 400

    result = todo_col.update_one(
        {"creator": creator, "trip_id": trip_id},
        {"$set": {task: True}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Todo list not found."}), 404
    elif result.modified_count == 0:
        return jsonify({"message": "Task already exists."}), 200


    return jsonify({"message": "Task added."})

# 3. Mark task as done (set to False)
@todo_bp.route('/todo/complete_task', methods=['POST'])
def complete_task():
    data = request.json
    creator = data.get("creator")
    trip_id = data.get("trip_id")
    task = data.get("task")

    if not (creator and trip_id and task):
        return jsonify({"error": "Missing required fields."}), 400

    doc = get_todo_doc(creator, trip_id)
    if not doc or task not in doc:
        return jsonify({"error": "Task not found."}), 404

    todo_col.update_one(
        {"_id": doc["_id"]},
        {"$set": {task: False}}
    )

    # Check if all tasks are completed
    updated_doc = todo_col.find_one({"_id": doc["_id"]})
    tasks_only = {k: v for k, v in updated_doc.items() if k not in ["_id", "creator", "trip_id"]}
    all_done = all(v is False for v in tasks_only.values())

    return jsonify({"message": "Task marked as done.", "all_done": all_done})

# 4. Delete entire todo list by trip and creator
@todo_bp.route('/todo/delete_list', methods=['DELETE'])
def delete_list():
    data = request.json
    creator = data.get("creator")
    trip_id = data.get("trip_id")

    if not (creator and trip_id):
        return jsonify({"error": "Missing required fields."}), 400

    doc = get_todo_doc(creator, trip_id)
    if not doc:
        return jsonify({"error": "Todo list not found."}), 404

    todo_col.delete_one({"_id": doc["_id"]})

    users_col.update_one(
        {"creator": creator},
        {"$pull": {"todos": str(doc["_id"])}}
    )

    return jsonify({"message": "Todo list deleted."})

@todo_bp.route('/todo/plans', methods=['GET'])
def get_user_plans():
    user_id = request.args.get('creator')
    if not user_id:
        return jsonify({"error": "Missing creator parameter"}), 400

    plans = list(plans_col.find({"creator": user_id}))
    for plan in plans:
        plan["_id"] = str(plan["_id"])
    return jsonify(plans)

@todo_bp.route('/todo/todos', methods=['GET'])
def get_todo_list():
    creator = request.args.get("user_id")  # changed from "creator"
    trip_id = request.args.get("trip_id")

    if not creator or not trip_id:
        return jsonify({"error": "Missing user_id or trip_id"}), 400

    doc = todo_col.find_one({"creator": creator, "trip_id": trip_id})
    if not doc:
        return jsonify({"tasks": []})  # Return empty if no list found

    tasks = [
        {"text": key, "done": not value}
        for key, value in doc.items()
        if key not in ["_id", "creator", "trip_id"]
    ]

    return jsonify({"tasks": tasks})

