from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
from app.extensions import mongo
from app.documents import documents_bp


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.abspath(os.path.join(BASE_DIR, '..', 'static', 'uploads'))

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@documents_bp.route('/upload_document', methods=['POST'])
def upload_document():
    file = request.files.get('file')
    user_id = request.form.get('user_id')
    trip_name = request.form.get('trip_name')

    if not file or not user_id or not trip_name:
        return jsonify({'message': 'Missing file, user_id, or trip_name'}), 400

    filename = secure_filename(file.filename)
    folder = os.path.join(UPLOAD_FOLDER, user_id, trip_name)
    os.makedirs(folder, exist_ok=True)

    filepath = os.path.join(folder, filename)
    file.save(filepath)

    return jsonify({'message': 'Upload successful'}), 200


@documents_bp.route('/documents', methods=['GET'])
def get_documents():
    user_id = request.args.get('user_id')
    trip_name = request.args.get('trip_name')
    if not user_id or not trip_name:
        return jsonify({'message': 'Missing user_id or trip_name'}), 400

    folder = os.path.join(UPLOAD_FOLDER, user_id, trip_name)
    if not os.path.exists(folder):
        return jsonify([])

    files = []
    for filename in os.listdir(folder):
        files.append({
            '_id': filename,
            'filename': filename,
            'file_url': f'/static/uploads/{user_id}/{trip_name}/{filename}'
        })

    return jsonify(files)


@documents_bp.route('/documents/<filename>', methods=['DELETE'])
def delete_document(filename):
    user_id = request.args.get('user_id')
    trip_name = request.args.get('trip_name')
    if not user_id or not trip_name:
        return jsonify({'message': 'Missing user_id or trip_name'}), 400

    filepath = os.path.join(UPLOAD_FOLDER, user_id, trip_name, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({'message': 'File deleted'}), 200
    else:
        return jsonify({'message': 'File not found'}), 404


@documents_bp.route('/static/uploads/<user_id>/<trip_name>/<filename>')
def serve_uploaded_file(user_id, trip_name, filename):
    return send_from_directory(os.path.join(UPLOAD_FOLDER, user_id, trip_name), filename)


@documents_bp.route('/user_trips', methods=['GET'])
def get_user_trips():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'message': 'Missing user_id'}), 400

    plans_collection = mongo.get_db("Users").get_collection("plans")
    plans = plans_collection.find({'creator': user_id})

    trip_names = [plan.get('name') for plan in plans if 'name' in plan]
    return jsonify(sorted(list(set(trip_names))))
