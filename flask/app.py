import os
import datetime
from flask import Flask, request,jsonify
from flask_sqlalchemy import SQLAlchemy 
from flask_jwt_extended import create_access_token, JWTManager, get_jwt_identity, jwt_required
from dotenv import load_dotenv, dotenv_values
from flask_cors import CORS,cross_origin
from datetime import timedelta

# Init app
app = Flask(__name__, static_folder='./static', static_url_path='/')
CORS(app, resources={r"/*": {"origins": "*"}})
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv()
# Database
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///image_comparison.db'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
# app.config['SECRET_KEY'] = 'SUPER-SECRET-KEY'
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
# app.config['CORS_HEADERS'] = 'Content-Type'
# Init db
db = SQLAlchemy(app)
# db.init_app(app)

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=72)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = datetime.timedelta(days=30)
app.config['APPLICATION_ROOT'] = os.getenv('APPLICATION_ROOT')
app.config['UPLOAD_ROOT'] = os.getenv('UPLOAD_ROOT')
jwt=JWTManager(app)



@app.route("/")
def welcome():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


from controllers import *
from models import *

from flask import send_from_directory

@app.route('/uploads/<path:path>')
def send_report(path):
    return send_from_directory('uploads', path)

# Run Server
if __name__ == '__main__':
  # with app.app_context():
  #   db.create_all()
  app.run(debug=True)