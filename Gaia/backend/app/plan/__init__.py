from flask import Blueprint

bp = Blueprint('plan', __name__)

from app.plan import routes
