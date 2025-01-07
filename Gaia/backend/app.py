from app import create_app
#from app.extensions import mongo
from flask import Flask

app = create_app()
app.run(host='0.0.0.0', port=5000, debug=True)