from flask import Flask
from .extensions import mongo 
from .main import main_bp  # Import the blueprint from the main package
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    mongo.init_app(app)

    # Register blueprints
    app.register_blueprint(main_bp, url_prefix='/api')

    return app
