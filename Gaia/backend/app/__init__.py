from flask import Flask
from .extensions import mongo 
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    mongo.init_app(app)

    # Register blueprints
    from app.main import main_bp  
    app.register_blueprint(main_bp)

    from app.trip import bp as trip_bp
    app.register_blueprint(trip_bp, url_prefix='/trip')

    from app.documents import documents_bp
    app.register_blueprint(documents_bp)

    from app.chats.routes import chat_bp
    app.register_blueprint(chat_bp, url_prefix="/api")


    for rule in app.url_map.iter_rules():
        print(rule)

    return app
