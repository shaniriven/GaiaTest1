from config import Config
from flask import Flask

from .extensions import mongo


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

    from app.home import bp as home_bp
    app.register_blueprint(home_bp, url_prefix='/home')
    
    from app.plan import bp as plan_bp
    app.register_blueprint(plan_bp, url_prefix='/plan')

    from app.documents import documents_bp
    app.register_blueprint(documents_bp)

    from app.chats.routes import chat_bp
    app.register_blueprint(chat_bp)

    from app.documents.saved_chats_routes import saved_chats_bp
    app.register_blueprint(saved_chats_bp, url_prefix='/documents')

    from app.documents.todo_routes import todo_bp
    app.register_blueprint(todo_bp, url_prefix='/documents')

    for rule in app.url_map.iter_rules():
        print(rule)

    return app
