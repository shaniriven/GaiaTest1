from flask import Blueprint

documents_bp = Blueprint('documents_bp', __name__)
from app.documents import routes