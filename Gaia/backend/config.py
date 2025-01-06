import os
from dotenv import load_dotenv

try:
    load_dotenv()
except ImportError:
    print(ImportError)

basedir = os.path.abspath(os.path.dirname(__file__))
mongo_user = os.environ.get('MONGODB_USER', None)
mongo_password = os.environ.get('MONGODB_PASSWORD', None)

class Config:
    TESTING = False
    MONGO_URI = "mongodb+srv://dor:dor1q2w%21shani@test1.mrqw5.mongodb.net/"
    SECRET_KEY=os.environ.get('SECRET_KEY','Gaia')