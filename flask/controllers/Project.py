import datetime
from app import db, app, request, jwt
from flask import Flask, request,jsonify
from flask_jwt_extended import create_access_token, JWTManager, get_jwt_identity, jwt_required, current_user
from models.Project import *

@app.route("/project/add",methods=["POST"])
@jwt_required()
def project_add():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']   

    dataVal = request.get_json()
    project_name = dataVal['project_name']
    if not project_name:
        return {
            "success":False,
            "code":400,
            'message':"Missing Project name."
        },400
    try:
        project_insert = Project(
            project_name=project_name
        )
        db.session.add(project_insert)
        db.session.commit()
        return {
            "success":True,
            "code":200,
            'message':"Project added successfully."
        },200 
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200