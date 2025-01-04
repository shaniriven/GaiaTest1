"""""
from flask import Flask
from config import Config, TestingConfig
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from app.extensions import mongo
import mongomock
from flask import Blueprint, render_template, request, redirect, url_for, flash

def create_app(config_class=Config):

    app = Flask(__name__)
    
    # Register blueprints here
    @app.route('/test/')
    def test_page():
        return '<h1>Testing the Flask Application Factory Pattern</h1>'
    
    return app
"""
from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
   
    return app

app=create_app()

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Gaia Server!"})