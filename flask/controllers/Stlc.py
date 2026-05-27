import datetime
from app import db, app, request, jwt
from flask import Flask, request,jsonify
from flask_jwt_extended import create_access_token, JWTManager, get_jwt_identity, jwt_required, current_user
from sqlalchemy import asc, desc, create_engine
from extras.utilities import *
from models.Stlc import *
import pprint
from collections import Counter
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker
@app.route("/stlc/add",methods=["POST"])
@jwt_required()
def stlc_add():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']   

    dataVal = request.get_json()
    stlc_name = dataVal['stlc_name']
    default = int(dataVal['default'])
    if not stlc_name:
        return {
            "success":False,
            "code":400,
            'message':"Missing STLC name."
        },400
    try:
        stlc_insert = Stlc(
            stlc_name=stlc_name, 
            default=default,
        )
        db.session.add(stlc_insert)
        db.session.commit()
        return {
            "success":True,
            "code":200,
            'message':"STLC added successfully."
        },200 
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200
#List of all Project Category
@app.route("/stlc/active",methods=["GET"])

def list_stlcw():
    category_name = "Greenfield Digital Transformation"
    catQuery = Effortsdistribution.query.filter_by(cat_name = category_name).order_by(asc(Effortsdistribution.stlc_name))
    catList = [
        
        dict(
            eDisId=row.e_dis_id,
            catName=row.cat_name,
            stlcName=row.stlc_name,
            standardBreakup=row.standard_breakup,
            overrideBreakup=row.override_breakup,
            stlstatuscName=row.status,
            category_name=category_name,
        )
        for row in catQuery
    ]        
    return {
        "success":True,
        "code":200,
        "data":catList,
        'message':"All effort list."
    },200 

#List of all Project Category
@app.route("/stlc/calculation",methods=["GET"])
@jwt_required()
def get_calculatiown():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']
    catQuery = Calculation.query.filter_by(status = 1, added_by=logged_user_email).order_by(asc(Calculation.phase_id)).all()
    catList = []
    bgColor='#000000'
    
    for cal in catQuery:        
        calyearQuery = Calculationyear.query.filter_by(cal_id = cal.cal_id, stlc_name=cal.stlc_name).all()
        for calyear in calyearQuery: 
            pQu = Phase.query.filter_by(phase_id = cal.phase_id).first()
            if(cal.phase_id ==1):
                bgColor='#ffffff'
                
            if(cal.phase_id ==2):
                bgColor='#f1f1f1'
                
            if(cal.phase_id ==3):
                bgColor='#ffffff'
                
            if(cal.phase_id ==4):
                bgColor='#f1f1f1'
                
            item={
                'bgColor': bgColor,
                'phase_id': pQu.phase_name,
                'stlc_name': calyear.stlc_name,
                'cal_id': calyear.cal_id,
                'pod': float(cal.pod),
                'poa': float(cal.poa),
                'overr': float(cal.overr),
                'poaph': float(cal.poaph),
                'podph': float(cal.podph),
                'oes': float(cal.oes),
                'sais': cal.sais,
                'yeara': float(calyear.yeara),
                'yearb': float(calyear.yearb),
                'yearc': float(calyear.yearc),
                'yeard': float(calyear.yeard),
                'yeare': float(calyear.yeare),
            }
            catList.append(item)
    return {
        "success":True,
        "code":200,
        "data":catList,
        'message':"All effort list."
    },200 
