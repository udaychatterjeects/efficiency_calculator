import datetime
import hashlib
from app import db, app, request, jwt
from flask import Flask, request,jsonify
from flask_jwt_extended import create_access_token, JWTManager, get_jwt_identity, jwt_required, current_user
# from validate_email import validate_email
from sqlalchemy import asc, desc
import uuid
import secrets
from controllers.Auth import * 
from models.User import *
from models.Squad import *


#List of all Users
@app.route("/user/list",defaults={'userId': None}, methods=["GET"])
@app.route("/user/list/<path:userId>", methods=["GET"])
@jwt_required()
def list_user(userId):
    userDetails = get_jwt_identity()
   
    try:
        userQuery=User.query
        if userId!=None:
            userQuery=userQuery.filter_by(user_id=userId).all()
        if userDetails['role'] == "Admin":
            userQuery = userQuery.order_by(asc(User.user_id)).all()

        userList = [
            dict(
                userId=row.user_id, 
                userName=f"{row.firstname} {row.lastname}",
                name=row.firstname,
                firstName=row.firstname,
                lastName=row.lastname,
                email=row.email,
                role=row.user_role,
                locked=True if row.email_confirmed == 0 else False,
                # firstName=row.firstname,
                # lastName=row.lastname
            )
            for row in userQuery
        ]        
        return userList,200
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200
    

#List of all Users
@app.route("/user/edit", methods=["POST"])
@jwt_required()
def edit_user():
    userDetails = get_jwt_identity()
    try:
        data = request.get_json()
        userId = data['userId']
        userEmail = data['userEmail']
        firstName = data['firstName']
        lastName = data['lastName']
        userRole = data['userRole']

        if (User.query.filter_by(user_id = userId, email = userEmail).count() <=0):
                return jsonify({
                    "success":False,
                    "code":400,
                    "message":"Invalid user.",
                }),200
        if not firstName:
            return {
                "success":False,
                "code":400,
                'message':"Missing first name."
            },400
        if not lastName:
            return {
                "success":False,
                "code":400,
                'message':"Missing last name."
            },400
        if not userRole:
            return {
                "success":False,
                "code":400,
                'message':"Missing user role."
            },400
        
        userInfo = User.query.filter_by(user_id = userId, email = userEmail).first()
        userInfo.firstname = firstName
        userInfo.lastname = lastName
        userInfo.user_role = userRole
        db.session.commit()
        return {
            "success":True,
            "code":200,
            'message':"User updated successfully."
        },200 
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200
    
#Delete User
@app.route("/user/delete/<int:userId>",methods=["DELETE"])
@jwt_required()
def delete_user(userId):
    userDetails = get_jwt_identity()
    userData = User.query.filter_by(user_id = userId).first()
    if (userData.user_role != "User"):
            return {
                "success":False,
                "code":400,
                'message':"Unable to delete Admin."
            },400

    try:
        User.query.filter_by(user_id = userId).delete()
        db.session.commit()
        
        return {
                "success":True,
                "code":200,
                'message':"User deleted successfully."
        },200
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200



# #Function to create Squad
@app.route('/usersquad/add', methods=['POST'])
@jwt_required()
def create_user_squad():    
    data = request.get_json()
    # squad_id = uuid.uuid4().hex
    user_id = data['userId']
    squad_id = data['squadId']

    if not user_id or not squad_id:
            return {
                "success":False,
                "code":400,
                'message':"Missing user or squad."
            },400
    
    if UserSquad.query.filter_by(user_id=user_id, squad_id=squad_id).count() >0:
            return {
                "success":False,
                "code":400,
                'message':"User with same squad name already exists."
            },400
    # return squad_name
    new_user_squad = UserSquad(user_id=user_id, squad_id=squad_id)
    db.session.add(new_user_squad)
    db.session.commit()
    
    return {
        "success":True,
        "code":200,
        'message':"User squad added successfully."
    },200 

#List of all Users
@app.route("/usersquad/list",methods=["GET"])
@jwt_required()
def squad_list_by_user():
    userDetails = get_jwt_identity()
    try:
        userSquadQuery = db.session.query(UserSquad)
        userSquadQuery = userSquadQuery.join(User, UserSquad.user_id == User.user_id)
        
        userSquadList = [
            dict(
                userSquadId=row.user_squad_id,
                userId=row.user_id,
                userName=row.userdata.firstname+' '+row.userdata.lastname,
                email=row.userdata.email,
                squadId=row.squad_id,
                squadName=row.squaddata.squad_name,
                role=row.userdata.user_role
            )
            for row in userSquadQuery
        ]
        return userSquadList,200 
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200
    
#Delete application squad
@app.route("/usersquad/delete/<int:userSquadId>",methods=["DELETE"])
@jwt_required()
def delete_usersquad(userSquadId):
    userDetails = get_jwt_identity()
    try:
        UserSquad.query.filter_by(user_squad_id = userSquadId).delete()
        db.session.commit()
        
        return {
                "success":True,
                "code":200,
                'message':"User squad deleted successfully."
        },200
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200

#Function to create Squad
@app.route('/usersquad/update', methods=['PUT'])
@jwt_required()
def update_user_squad():    
    data = request.get_json()
    user_id = data['userId']
    new_user_id = data['newUserId']
    new_squad_id = data['newSquadId']
    squad_id = data['squadId']

    if UserSquad.query.filter_by(user_id=new_user_id, squad_id=new_squad_id).count() >0:
            return {
                "success":False,
                "code":400,
                'message':"User with same squad name already exists."
            },400

    try:
        if not user_id or not squad_id:
                return {
                    "success":False,
                    "code":400,
                    'message':"Missing user or squad."
                },400
        if (UserSquad.query.filter_by(user_id = user_id, squad_id = squad_id).count() <=0):
            return jsonify({
                "success":False,
                "code":400,
                "message":"Invalid user or squad.",
            }),200
             
        else:
            UserSquad.query.filter_by(user_id = user_id, squad_id = squad_id).delete()
            db.session.commit()
            
            # return squad_name
            new_user_squad = UserSquad(user_id=new_user_id, squad_id=new_squad_id)
            db.session.add(new_user_squad)
            db.session.commit()
            
            return {
                "success":True,
                "code":200,
                'message':"UserSquad updated successfully."
            },200
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200
    
#List of all Users
@app.route("/token/list",methods=["GET"])
@jwt_required()
def token_list():
    userDetails = get_jwt_identity()
    try:
        userTokenQuery=db.session.query(Usertoken)
        
        userTokenList = [
            dict(
                userId=row.user_id,
                user_EmailID=row.user_email,
                resetToken=row.reset_token,
                requestedOn=row.requested_on
            )
            for row in userTokenQuery
        ]
        return userTokenList,200 
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200
    