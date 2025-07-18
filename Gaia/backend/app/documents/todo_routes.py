from flask import Blueprint, request, jsonify
from app.extensions import mongo
from bson import ObjectId
import time
import random

documents_bp = Blueprint('documents_bp', __name__)

def generate_id():
    return str(int(time.time() * 1000)) + str(random.randint(1000, 9999))

# GET: Fetch existing to-do list for user & trip
@documents_bp.route('/todo_list', methods=['GET'])
def get_todo_list():
    user_id = request.args.get('user_id')
    trip_name = request.args.get('trip_name')
    if not user_id or not trip_name:
        return jsonify({'message': 'Missing user_id or trip_name'}), 400

    db = mongo.get_db("Users")
    todo_collection = db.get_collection("todoLists")
    todo = todo_collection.find_one({'user_id': user_id, 'name': trip_name})

    if not todo:
        return jsonify({'exists': False, 'tasks': []})

    tasks = todo.get('tasks', [])
    updated = False

    for task in tasks:
        if 'id' not in task:
            task['id'] = generate_id()
            updated = True

    if updated:
        todo_collection.update_one({'_id': todo['_id']}, {'$set': {'tasks': tasks}})

    return jsonify({
        'exists': True,
        'list_id': str(todo['_id']),
        'trip_id': todo.get('trip_id'),
        'tasks': tasks
    })

# ✅ POST: Create a new to-do list
@documents_bp.route('/todo_list', methods=['POST'])
def create_todo_list():
    data = request.get_json()
    user_id = data.get('user_id')
    trip_name = data.get('trip_name')
    trip_id = data.get('trip_id')

    if not user_id or not trip_name or not trip_id:
        return jsonify({'message': 'Missing user_id, trip_name, or trip_id'}), 400

    db = mongo.get_db("Users")
    todo_collection = db.get_collection("todoLists")
    users_collection = db.get_collection("users")

    # Create new list
    new_list = {
        'list_id': ObjectId(),
        'creator': user_id,
        'trip_id': trip_id,
        'name': trip_name,
        'tasks': []
    }

    inserted = todo_collection.insert_one(new_list)

    # Update user.todos field with the new list ID
    users_collection.update_one(
        {'creator': user_id},
        {'$addToSet': {'todos': str(inserted.inserted_id)}},
        upsert=True
    )

    return jsonify({
        'message': 'List created successfully',
        'list_id': str(inserted.inserted_id),
        'trip_id': trip_id,
        'tasks': []
    }), 201
