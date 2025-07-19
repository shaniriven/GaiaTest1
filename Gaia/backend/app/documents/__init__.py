from flask import Blueprint

documents_bp = Blueprint('documents_bp', __name__)

# These ensure route files are registered
from app.documents import routes
from app.documents import todo_routes  
from app.documents import saved_chats_routes
