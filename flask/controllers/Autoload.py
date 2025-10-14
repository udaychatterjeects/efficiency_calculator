import datetime
# import hashlib
from app import db, app, request, jwt
from flask import Flask, request,jsonify
from flask_jwt_extended import create_access_token, JWTManager, get_jwt_identity, jwt_required, current_user
from sqlalchemy import asc, desc
import uuid
import secrets
from extras.utilities import *
from models.Application import *
from models.Squad import *
from models.Baseline import *
from models.Comparison import *
from models.User import *
from sqlalchemy import func
import shutil


#List of all Users
@app.route("/autoload",methods=["POST"])
def autoload_data():
    data = request.get_json()
    # Add Admin
    admin_user = "admin1@test.com"
    password = encrypt_password("Admin1@test.com")
    firstname = "Admin"
    lastname = "One"
    currentTime = datetime.datetime.now()
   
    # new_user = User(email=admin_user, password=password, firstname=firstname, lastname=lastname, user_role="Admin", email_confirmed=1,created_at=currentTime)
    # db.session.add(new_user)
    # db.session.commit()

    # Add efficiency table
    dataArr=[
        {
            "stlc_name":"Test Planning and Strategy",
            "cat_name":"Greenfield Digital Transformation",
            "standard_breakup":"5",
            "override_breakup":"5",
            "status":1,
        },
        {
            "stlc_name":"Test Scenario/ Test Cases/BDD (Manual)",
            "cat_name":"Greenfield Digital Transformation",
            "standard_breakup":"15",
            "override_breakup":"15",
            "status":1,
        }
    ]
    for data in dataArr:
        print(data['stlc_name'])
        
    
    
    return {
            "success":True,
            "code":200,
            'message':"Data Load Successfully Completed."
    },200
    
    
