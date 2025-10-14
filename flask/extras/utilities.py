import hashlib
import os
import time
from flask import Flask
from flask_restful import Resource, Api, reqparse
from models.User import *
from models.Effortsdistribution import *

# Encrypt Password
def encrypt_password(password):
    password_bytes = password.encode('utf-16')
    hash_object = hashlib.sha256(password_bytes)
    password = hash_object.hexdigest()  

    return password

# Validation password  
def password_check(passwd):     
    SpecialSym =['!', '@', '#', '$', '%', '&', '(', ')', '-', '_', '[', ']', '{', '}', ';', ':', '"', '.', '/', '<', '>', '?']
    val = True
     
    if len(passwd) < 8:
        val = False
         
    if len(passwd) > 20:
        val = False
         
    if not any(char.isdigit() for char in passwd):
        val = False
         
    if not any(char.isupper() for char in passwd):
        val = False
         
    if not any(char.islower() for char in passwd):
        val = False
         
    if not any(char in SpecialSym for char in passwd):
        val = False
    if val:
        return val
    
def get_user_id_by_email(userEmail):
    userQuery=User.query.filter_by(email=userEmail).first()
    return userQuery.user_id

def calculate_oes(stlc_name_val):
    oesPer = 0
    cogQuery = Cognitivesolutions.query.filter_by(stlc_name = stlc_name_val).all()
    for cog in cogQuery:
        oesPer = oesPer+((cog.effort_savings*cog.implementation)/100)
    return oesPer 

def insert_calculation(stlc_name,catelog_name,pod):
    sais=catelog_name.replace(",", "",1)
    cal_inst = Calculation(
        stlc_name=stlc_name, 
        sais=sais,
        pod=pod,
        poa=0,
        overr=0,
        podph=0,
        poaph=0,
        oes=0,
        status=1,
        category_name="category_name",
        ini_duration=9,
        ini_day=9,
    )
    db.session.add(cal_inst)
    db.session.commit()
    calculationId = cal_inst.cal_id  
    return calculationId