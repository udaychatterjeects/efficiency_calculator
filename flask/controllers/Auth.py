import datetime
import hashlib
from app import db, app, request, jwt
from flask import Flask, request,jsonify
from flask_jwt_extended import create_access_token, JWTManager, get_jwt_identity, jwt_required, current_user
# from validate_email import validate_email
from sqlalchemy import asc, desc
import uuid
import secrets
from extras.utilities import *
from models.User import *
from controllers.Defaultdata import insert_default_solution, insert_default_effort



#Function to create user
@app.route('/user/signup', methods=['POST'])
def create_user():
    
    try:
        currentTime = datetime.datetime.now()
        data = request.get_json()
        email = data['email']
        password = encrypt_password(data['password'])  
        
        user_role = data['role']
        firstName = data['firstname']
        lastName = data['lastname']
        if not password_check(data['password']):
            return {
                "success":False,
                "code":400,
                'message':"Invalid password !!"
            },400
        if User.query.filter_by(email=email).first():
            return {
                    "success":False,
                    "code":400,
                    'message':"email already exists."
                },400
        new_user = User(email=email, password=password, firstname=firstName, lastname=lastName, user_role=user_role, email_confirmed=0, created_at=currentTime)
        db.session.add(new_user)
        db.session.commit()
        return {
            "success":True,
            "code":201,
            'message':"User added successfully."
        },201
    
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),500

#Authentication function
@app.route("/user/login", methods=["POST"])
def Login():
    try:
        email_confirmed = 0
        data = request.get_json()
        email = data['email']        
        password = encrypt_password(data['password'])

        user=User.query.filter_by(email=email).first()
       
        if User.query.filter_by(email=email, password=password).count() <= 0:
            return jsonify({
                "success":False,
                "code":404,
                "message":"Invalid email or passwords."
            }),200
        
        if user.email_confirmed == 0:
            return jsonify({
                "success":False,
                "code":404,
                "message":"Please activate your account."
            }),200
        
        if user.email_confirmed == 1 and user.password == password:
            # print("AAA")   
            token = create_access_token(identity ={'user':user.email,'role':user.user_role})
        # print("BBB")  
        # print(token)   
        return jsonify({
            "success":True,
            "code":200,
            "userId":user.user_id,
            "userName": user.email,
            "message":"Login successful.",
            "token":token,
            "displayName": user.firstname,
            "email": user.email,
            "role": user.user_role
        }),200
    except:
        return jsonify({
            "success":False,
            "codee":404,
            "message":"hI."
        }),200 
        # return jsonify({
        #     "success":False,
        #     "code":500,
        #     "message":"System encountered an unexpected problem and is being tracked.",
        # }),500

#Activate Registerd User
@app.route("/user/activate", methods=["POST"])
def user_activate():
    try:
        email_confirmed = 0
        data = request.get_json()
        email = data['email']           
        if User.query.filter_by(email=email).count() <= 0:
            return jsonify({
                "success":False,
                "code":404,
                "message":"Invalid user email to activate."
            }),200   
        
        solution_cnt=Applicablecognitivesolutions.query.filter_by(added_by=email).count()
        effort_cnt=Effortsdistribution.query.filter_by(added_by=email).count()

        # if Applicablecognitivesolutions.query.filter_by(added_by=email).count() <= 0:
        #     add_def_solutions = insert_default_solution(email)
        #     return jsonify({
        #         "success":False,
        #         "code":404,
        #         "message":"User activated successfully."
        #     }),200    

        if (solution_cnt <= 0 and effort_cnt <=0):
            add_def_solutions = insert_default_solution(email)
            add_def_efforts = insert_default_effort(email)
            return jsonify({
                "success":False,
                "code":404,
                "message":"User activated successfully."
            }),200     
        
        return jsonify({
                "success":False,
                "code":404,
                "message":"User already activated."
            }),200  
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),500
    
@app.route('/user/tokenstatus', methods=['POST'])
def check_user_token():
    try:
        currentTime = datetime.datetime.now()
        data = request.get_json()
        email = data['EmailID']
        reset_token = secrets.token_hex(50)
        
        if User.query.filter_by(email=email).count() > 0:
            user = User.query.filter_by(email=email).first()
            if Usertoken.query.filter_by(user_id=user.user_id).count() <= 0:        
                if user.user_id :
                    new_user = Usertoken(user_id=user.user_id, user_email=email, reset_token=reset_token, requested_on=currentTime)
                    db.session.add(new_user)
                    db.session.commit()
            return jsonify({
                "success":True,
                "code":200,
                "message":"",
                "tokenExist":False
            }),200
        else:
            return jsonify({
                "success":False,
                "code":404,
                "message":"Invalid email ID.",
            }),404
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),500


# @app.route('/user/generatetoken', methods=['POST'])
# def generate_token():
#     # try:
#         currentTime = datetime.datetime.now()
#         data = request.get_json()
#         email = data['EmailID']
#         reset_token = secrets.token_hex(50)
#         # return reset_token
#         # return jsonify({
#         #         "success":True,
#         #         "code":200,
#         #         "message":"",
#         #         "tokenExist":False
#         #     }),200
#         if User.query.filter_by(email=email).count() > 0:
#             user = User.query.filter_by(email=email).first()
#             if Usertoken.query.filter_by(user_id=user.user_id).count() <= 0:        
#                 if user.user_id :
#                     new_user = Usertoken(user_id=user.user_id, user_email=email, reset_token=reset_token, requested_on=currentTime)
#                     db.session.add(new_user)
#                     db.session.commit()
#             return jsonify({
#                 "success":True,
#                 "code":200,
#                 "message":"Token Generated successfully.",
#                 # "tokenExist":False
#             }),200
#         else:
#             return jsonify({
#                 "success":False,
#                 "code":200,
#                 "message":"Invalid email ID.",
#             }),200
        

@app.route('/user/changepassword', methods=['POST'])
def change_password():
    try:
        data = request.get_json()
        email = data['username']
        token = data['token']
        # confirmPassword = data['confirmPassword']
        password = encrypt_password(data['password'])

        # Validate Password
        if not password_check(data['password']):
            return {
                "success":False,
                "code":400,
                'message':"Invalid password !!"
            },400
        
        # If token already created
        if Usertoken.query.filter_by(reset_token=token).count()>0:
            update_password = User.query.filter_by(email=email).one()
            update_password.password = password
            db.session.commit()

            Usertoken.query.filter_by(user_email = email).delete()
            db.session.commit()
            return jsonify({
                "success":True,
                "code":200,
                "message":"Password updated successfully."
            }),200
        else:
            return jsonify({
                "success":False,
                "code":404,
                "message":"Invalid token."
            }),404
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),500

@app.route('/user/generatetoken', methods=['POST'])
def generate_token():
    try:
        currentTime = datetime.datetime.now()
        data = request.get_json()
        email = data['EmailID']
        reset_token = secrets.token_hex(50)
       
        if User.query.filter_by(email=email).count() > 0:
            user = User.query.filter_by(email=email).first()
            if Usertoken.query.filter_by(user_id=user.user_id).count() <= 0:        
                if user.user_id :
                    new_user = Usertoken(user_id=user.user_id, user_email=email, reset_token=reset_token, requested_on=currentTime)
                    db.session.add(new_user)
                    db.session.commit()
            return jsonify({
                "success":True,
                "code":200,
                "message":"Token Generated successfully.",
            }),200
        else:
            return jsonify({
                "success":False,
                "code":404,
                "message":"Invalid email ID.",
            }),404
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),500    

@app.route('/user/lockunlockuser', methods=['POST'])
def lock_unlock_user():
    # try:        
        data = request.get_json()
        userEmail = data['email']
        userQuery=User.query.filter_by(email=userEmail).first()
        email_confirmed=userQuery.email_confirmed
        if email_confirmed == 1 :
            new_email_confirmed =0
        else:
            new_email_confirmed =1
       
        userQuery.email_confirmed = new_email_confirmed
        db.session.commit()

        return jsonify({
            "success":True,
            "code":200,
            "message":"Status updated successfully."
        }),200
            