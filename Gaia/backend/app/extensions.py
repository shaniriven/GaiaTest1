"""
from pymongo import MongoClient
class PyMongoClient:
    def __init__(self):
        self.client = None

    def init_app(self, app):
        self.client = MongoClient(app.config['MONGO_URI'])

    def set_client(self, client):
        self.client = client

mongo = PyMongoClient()
"""

from pymongo import MongoClient
import os

class Mongo:
    client = None

    def init_app(self, app):
        mongo_uri = app.config.get('MONGO_URI', 'mongodb://localhost:27017')
        self.client = MongoClient(mongo_uri)
        app.db = self.client.get_database("GaiaDB")  # or specify a database name

    def get_db(self, db_name):
        return self.client.get_database(db_name)
    
# Create an instance to be imported
mongo = Mongo()
