from flask import Blueprint

bp = Blueprint('trip', __name__)

from app.trip import routes