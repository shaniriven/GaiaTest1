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


    return app
