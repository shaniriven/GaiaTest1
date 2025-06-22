from app.documents import documents_bp  # Get the blueprint
from flask import request, jsonify, send_from_directory
from app.extensions import mongo
import os
from bson import ObjectId
from werkzeug.utils import secure_filename
from datetime import datetime

# Upload folder inside the project
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads'))

@documents_bp.route('/upload_document', methods=['POST'])
def upload_document():
    file = request.files.get('file')
    user_id = request.form.get('user_id')

    if not file or not user_id:
        return jsonify({'message': 'Missing file or user_id'}), 400

    filename = secure_filename(file.filename)
    user_folder = os.path.join(UPLOAD_FOLDER, user_id)
    os.makedirs(user_folder, exist_ok=True)

    filepath = os.path.join(user_folder, filename)
    file.save(filepath)

    doc_data = {
        'user_id': user_id,
        'filename': filename,
        'file_path': filepath,
        'file_url': f'/static/uploads/{user_id}/{filename}',
        'uploaded_at': datetime.utcnow()
    }

    db = mongo.get_db("Users")  # ✅ Correct usage
    inserted = db.documents.insert_one(doc_data)

    return jsonify({'message': 'Upload successful', 'document_id': str(inserted.inserted_id)}), 200


@documents_bp.route('/documents', methods=['GET'])
def get_documents():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'message': 'Missing user_id'}), 400
    db= mongo.get_db("Users")
    docs = db.documents.find({'user_id': user_id})
    result = []
    for doc in docs:
        result.append({
            '_id': str(doc['_id']),
            'filename': doc['filename'],
            'file_url': f"/static/uploads/{user_id}/{doc['filename']}",
            'uploaded_at': doc['uploaded_at']
        })

    return jsonify(result)


@documents_bp.route('/documents/<doc_id>', methods=['DELETE'])
def delete_document(doc_id):
    try:
        db = mongo.get_db("Users")
        doc = db.documents.find_one({'_id': ObjectId(doc_id)})
        if not doc:
            return jsonify({'message': 'Document not found'}), 404

        if os.path.exists(doc['file_path']):
            os.remove(doc['file_path'])

        db.documents.delete_one({'_id': ObjectId(doc_id)})

        return jsonify({'message': 'Document deleted'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500



@documents_bp.route('/static/uploads/<user_id>/<filename>', endpoint='serve_user_upload')
def serve_uploaded_file(user_id, filename):
    return send_from_directory(os.path.join(UPLOAD_FOLDER, user_id), filename)

print("✅ documents_bp ROUTES LOADED")
