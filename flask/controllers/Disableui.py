import datetime
# import hashlib
from app import db, app, request, jwt
from flask import Flask, request,jsonify
from flask_jwt_extended import create_access_token, JWTManager, get_jwt_identity, jwt_required, current_user
from sqlalchemy import asc, desc
# import uuid
# import secrets
from extras.utilities import *
from models.Effortsdistribution import *
from sqlalchemy import func


#List of all Project Category
@app.route("/check/calculation",methods=["POST"])
@jwt_required()
def check_calculation():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']   
    chkCalc = Calculation.query.filter_by(status=1, added_by=logged_user_email).count()
      
    return {
        "success":True,
        "code":200,
        "data":chkCalc,
        'message':"Data Exists in Table."
    },200

    
