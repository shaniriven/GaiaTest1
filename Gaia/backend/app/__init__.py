from flask import Flask
from flask_pymongo import PyMongo
from config import Config
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from app.extensions import mongo
from flask import Blueprint, render_template, request, redirect, url_for, flash

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    mongo.init_app(app)
    
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)
    return app

