from app import db, app, request, jwt
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.Effortsdistribution import *
from extras.utils import get_response
from sqlalchemy import asc, desc
# import pandas as pd
from tabulate import tabulate
import json

@app.route("/dashboard/efficiency-gain-new",methods=["POST"])
@jwt_required()
def dashboard_efficiency_gain_new():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']   
    # pQuery = Phase.query.filter_by(status = 1).order_by(asc(Phase.phase_id)).all()
    resultp = Calculation.query.filter_by(phase_id = 1, added_by=logged_user_email).first() 
    duration=resultp.ini_duration
    catList = []
    newList = []
    col_name=''
    sumPod1 =0
    sumPod0 = 0    
    sumPod1 = 0    
    sumPod2 = 0 
    sumPod3 = 0 
    sumPod4 = 0 
    sp0Sum = 0
    sp1Sum = 0
    sp2Sum = 0
    sp3Sum = 0
    for x in range(0,duration+1):
        if(x==0):
            col_name = "Initial"
            sumPod0 = calculate_current_state(1,logged_user_email)
            sumPod1 = calculate_current_state(2,logged_user_email)
            sumPod2 = calculate_current_state(3,logged_user_email)
            sumPod3 = calculate_current_state(4,logged_user_email)            
            sumPod4="-"
            sumPod5="-"
            newItem={
                'col_name': col_name,
                'sp_ini0': sumPod0, 
                'sp_ini1': sumPod1,   
                'sp_ini2': sumPod2,   
                'sp_ini3': sumPod3,   
                'sp_ini4': sumPod4,   
                'sp_ini5': sumPod5,   
            }
            newList.append(newItem)
        if(x==1):
            col_name = "Year 1"
            sp0Sum = calculate_sp(1,logged_user_email)
            sp1Sum = calculate_sp(2,logged_user_email)
            sp2Sum = calculate_sp(3,logged_user_email)
            sp3Sum = calculate_sp(4,logged_user_email)
            # print(sp0Sum,sp1Sum,sp2Sum,sp3Sum)
            newItem={
                'col_name': col_name,
                'sp_ini0': sp0Sum, 
                'sp_ini1': sp1Sum,   
                'sp_ini2': sp2Sum,   
                'sp_ini3': sp3Sum,   
                'sp_ini4': 100-(sp0Sum+sp1Sum+sp2Sum+sp3Sum),   
                'sp_ini5': sumPod5,   
            }
            newList.append(newItem)
        if(x==2):
            col_name = "Year 2"

            isd0Sum = calculate_isd(1,logged_user_email)
            isd1Sum = calculate_isd(2,logged_user_email)
            isd2Sum = calculate_isd(3,logged_user_email)
            isd3Sum = calculate_isd(4,logged_user_email)
            newItem={
                'col_name': col_name,
                'sp_ini0': isd0Sum,   
                'sp_ini1': isd1Sum,   
                'sp_ini2': isd2Sum,   
                'sp_ini3': isd3Sum,   
                'sp_ini4': 100-(isd0Sum+isd1Sum+isd2Sum+isd3Sum),    
                'sp_ini5': '',   
            }
            newList.append(newItem)
        if(x==3):
            col_name = "Year 3"

            ise0Sum = calculate_ise(1,logged_user_email)
            ise1Sum = calculate_ise(2,logged_user_email)
            ise2Sum = calculate_ise(3,logged_user_email)
            ise3Sum = calculate_ise(4,logged_user_email)
            newItem={
                'col_name': col_name,
                'sp_ini0': ise0Sum,   
                'sp_ini1': ise1Sum,   
                'sp_ini2': ise2Sum,   
                'sp_ini3': ise3Sum,   
                'sp_ini4': 100-(ise0Sum+ise1Sum+ise2Sum+ise3Sum),    
                'sp_ini5': '',   
            }
            newList.append(newItem)
        if(x==4):
            col_name = "Year 4"
            
            srr0Sum = calculate_srr(1,logged_user_email)
            srr1Sum = calculate_srr(2,logged_user_email)
            srr2Sum = calculate_srr(3,logged_user_email)
            srr3Sum = calculate_srr(4,logged_user_email)

            newItem={
                'col_name': col_name,
                'sp_ini0': srr0Sum,   
                'sp_ini1': srr1Sum,   
                'sp_ini2': srr2Sum,   
                'sp_ini3': srr3Sum,   
                'sp_ini4': 100-(srr0Sum+srr1Sum+srr2Sum+srr3Sum),    
                'sp_ini5': '',    
            }
            newList.append(newItem)
        if(x==5):
            col_name = "Year 5"

            srr0Sum = calculate_srr2(1,logged_user_email)
            srr1Sum = calculate_srr2(2,logged_user_email)
            srr2Sum = calculate_srr2(3,logged_user_email)
            srr3Sum = calculate_srr2(4,logged_user_email)
            sumPod = "-"
            newItem={
                'col_name': col_name,
                'sp_ini0': srr0Sum,   
                'sp_ini1': srr1Sum,   
                'sp_ini2': srr2Sum,   
                'sp_ini3': srr3Sum,   
                'sp_ini4': 100-(srr0Sum+srr1Sum+srr2Sum+srr3Sum),   
                'sp_ini5': sumPod,   
            }
            newList.append(newItem)
    return {
        "success":True,
        "code":200,
        "data":newList,
        'message':"Data listing Successfully."
    },200 

def calculate_current_state(phase_id,logged_user_email):
    sumPod = 0
    result = Calculation.query.filter_by(phase_id = phase_id, added_by = logged_user_email).all() 
    for res in result:   
        sumPod = sumPod+float(res.pod)
    return sumPod

def calculate_sp(phase_id,logged_user_email):
    sumPod = 0
    # print(phase_id)
    result = Calculation.query.filter_by(phase_id = phase_id, added_by = logged_user_email).all() 
    for res in result:   
        sumPod = sumPod+float(res.pod)
        # print(sumPod)
    yearaSum =0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=phase_id, added_by = logged_user_email).all()        
    for cog in cogQuery: 
        yearaSum = yearaSum+float(cog.yeara_efficiency)
    print(sumPod,yearaSum)
    # print(phase_id)
    return sumPod-yearaSum

def calculate_isd(phase_id,logged_user_email):
    sumPod = 0
    result = Calculation.query.filter_by(phase_id = phase_id, added_by = logged_user_email).all() 
    for res in result:   
        sumPod = sumPod+float(res.pod)

    yearbSum =0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=phase_id, added_by = logged_user_email).all()        
    for cog in cogQuery: 
        yearbSum = yearbSum+float(cog.yearb_efficiency)
    return sumPod-yearbSum

def calculate_ise(phase_id,logged_user_email):
    sumPod = 0
    result = Calculation.query.filter_by(phase_id = phase_id, added_by = logged_user_email).all() 
    for res in result:   
        sumPod = sumPod+float(res.pod)

    yearcSum =0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=phase_id, added_by = logged_user_email).all()        
    for cog in cogQuery: 
        yearcSum = yearcSum+float(cog.yearc_efficiency)
    return sumPod-yearcSum

def calculate_srr(phase_id,logged_user_email):
    sumPod = 0
    result = Calculation.query.filter_by(phase_id = phase_id, added_by = logged_user_email).all() 
    for res in result:   
        sumPod = sumPod+float(res.pod)

    yeardSum =0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=phase_id, added_by = logged_user_email).all()        
    for cog in cogQuery: 
        yeardSum = yeardSum+float(cog.yeard_efficiency)
    return sumPod - yeardSum

def calculate_srr2(phase_id,logged_user_email):
    sumPod = 0
    result = Calculation.query.filter_by(phase_id = phase_id, added_by = logged_user_email).all() 
    for res in result:   
        sumPod = sumPod+float(res.pod)

    yeareSum =0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=phase_id, added_by = logged_user_email).all()        
    for cog in cogQuery: 
        yeareSum = yeareSum+float(cog.yeare_efficiency)
    return sumPod - yeareSum