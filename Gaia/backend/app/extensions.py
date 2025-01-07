from pymongo import MongoClient

class PyMongoClient:
    def __init__(self):
        self.client = None

    def init_app(self, app):
        self.client = MongoClient(app.config['MONGO_URI'])

    def set_client(self, client):
        self.client = client

mongo = PyMongoClient()