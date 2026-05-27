import datetime
from app import db, app, request, jwt
from flask import Flask, request,jsonify
from flask_jwt_extended import create_access_token, JWTManager, get_jwt_identity, jwt_required, current_user
from sqlalchemy import asc, desc, create_engine
from extras.utilities import *
from models.Effortsdistribution import *
import pprint
from collections import Counter
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker
@app.route("/calculate",methods=["POST"])
@jwt_required()
def add_calculation():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']   

    dataVal = request.get_json()
    category_name = dataVal['category_name']
    ini_duration = int(dataVal['ini_duration'])
    ini_day = dataVal['ini_day']
    allYearValueData = dataVal['allYearValueData']
    # print(allYearValueData)
    allImplementation = dataVal['allImplementation']
    phase_id = dataVal['phase_id']
    unique_phase_ids = unique(phase_id)    
    for z in allImplementation:
        if(z==""):
            return {
                "success":False,
                "code":400,
                'message':"You have to provide all implementation value."
            },400
        if not z.isnumeric():
            return {
                "success":False,
                "code":400,
                'message':"You have to provide only numeric value."
            },400
        if(int(z) <=0 or int(z) >100):
            return {
                "success":False,
                "code":400,
                'message':"Valueshould be between 0 to 100."
            },400
    
    oldValue=0
    for x in allYearValueData:
        print(x)
        if(x==""):
            return {
                "success":False,
                "code":400,
                'message':"You have to provide all yearwise value."
            },400
        if not x.isnumeric():
            return {
                "success":False,
                "code":400,
                'message':"You have to provide only numeric value."
            },400
        if(int(x) >100):
            return {
                "success":False,
                "code":400,
                'message':"Value cannot be more than 100."
            },400
        
        
    colPerRow = ini_duration
    totalDataCnt = len(allYearValueData)
    totalRowCnt = totalDataCnt/colPerRow

    for rval in range(int(totalRowCnt)):
        if(allYearValueData[((rval+1)*colPerRow)-1] !="100"):
            return {
                "success":False,
                "code":400,
                'message':"Final value should be 100 for each row."
            },400
    
    aIndex=0
    prevVal=0
    for aIn,aVal in enumerate(allYearValueData):
        aIndex=aIndex+1

        if(int(prevVal) > int(aVal)):
             return {
                "success":False,
                "code":400,
                'message':"Value expected to be ascending order."
            },400
        if(aIndex == ini_duration):
            aIndex=0
            prevVal=0
        else:
            prevVal = aVal

    cQuery = Cognitivesolutions.query.filter_by(status = 1, added_by=logged_user_email).order_by(asc(Cognitivesolutions.phase_name)).all()
    tC = 0
    yearaVal=0
    yearbVal=0
    yearcVal=0
    yeardVal=0
    yeareVal=0
    for cq in cQuery:
        startPos = ((int(tC)*colPerRow))
        newArr = chunks(allYearValueData,startPos,colPerRow)
        if(colPerRow == 1):
            yearaVal=float(newArr[0][0])
        if(colPerRow == 2):
            yearaVal=float(newArr[0][0])
            yearbVal=float(newArr[0][1])
        if(colPerRow == 3):
            yearaVal=float(newArr[0][0])
            yearbVal=float(newArr[0][1])
            yearcVal=float(newArr[0][2])
        if(colPerRow == 4):
            yearaVal=float(newArr[0][0])
            yearbVal=float(newArr[0][1])
            yearcVal=float(newArr[0][2])
            yeardVal=float(newArr[0][3])
        if(colPerRow == 5):
            yearaVal=float(newArr[0][0])
            yearbVal=float(newArr[0][1])
            yearcVal=float(newArr[0][2])
            yeardVal=float(newArr[0][3])
            yeareVal=float(newArr[0][4])
        tC=tC+1
        cuQuery = Cognitivesolutions.query.filter_by(sol_id = cq.sol_id).first()
        cuQuery.yeara = yearaVal 
        cuQuery.yearb = yearbVal
        cuQuery.yearc = yearcVal
        cuQuery.yeard = yeardVal
        cuQuery.yeare = yeareVal
        db.session.commit()

    coQuery = Cognitivesolutions.query.filter_by(added_by=logged_user_email).order_by(asc(Cognitivesolutions.phase_name)).all()
    for pos,phase in enumerate(coQuery):
        inSolQuery = Cognitivesolutions.query.filter_by(sol_id = phase.sol_id,added_by=logged_user_email).first()
        inSolQuery.implementation = allImplementation[pos] 
        db.session.commit()
                
    status = 1
    catQuery = Effortsdistribution.query.filter_by(cat_name = category_name,added_by=logged_user_email).order_by(asc(Effortsdistribution.stlc_name)).all()
    stlc_val_name=''
    podVal=0

    initial_effort=0
    for data in catQuery:
        stlc_val_name = data.stlc_name
        
        if (data.override_breakup != data.standard_breakup):
            podVal = float(data.override_breakup)
        else:
            podVal = float(data.standard_breakup)
        
        if podVal >0:  
            solQuery = Cognitivesolutions.query.filter_by(stlc_name = stlc_val_name,added_by=logged_user_email).all()
            catelog_name=''
            catelog_name_final=''
            for solData in solQuery:
                catelog_name = catelog_name+" , "+solData.catelog
                initial_effort = float(solData.initial_effort) 
            if(Cognitivesolutions.query.filter_by(stlc_name = stlc_val_name,added_by=logged_user_email).count() >0):
                max_value = max_pes(stlc_val_name)
            else:
                max_value = 0
            oesVal = calculate_oes(stlc_val_name)
            overrVal = (podVal*oesVal)/100
            poaVal = podVal - overrVal            
            podphVal = (initial_effort*podVal)/100
            poaphVal = (initial_effort*poaVal)/100
           
            # Insert into calculation table
            cal_inst = Calculation(
                stlc_name=stlc_val_name, 
                phase_id=data.phase, 
                sais=catelog_name.replace(",", "",1),
                pod=podVal,
                poa=poaVal,
                overr=overrVal,
                podph=podphVal,
                poaph=poaphVal,
                oes=oesVal,
                status=status,
                category_name=category_name,
                ini_duration=ini_duration,
                ini_day=ini_day,
                added_by=logged_user_email,
            )
            db.session.add(cal_inst)
            db.session.commit()
                  
            calculationId = cal_inst.cal_id           
    update_calculation(colPerRow, allYearValueData,calculationId,logged_user_email)
    
    return {
        "success":True,
        "code":200,
        'message':"Calculation Generated Successfully."
    },200



#List of all Project Category
@app.route("/stlc/active",methods=["GET"])

def list_stlc():
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
def get_calculation():
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

#List of all Project Category
@app.route("/stlc/yearcalculation",methods=["GET"])

def get_yearcalculation():
    catQuery = Calculationyear.query.order_by(asc(Calculationyear.cal_yr_id))
    catList = [
        
        dict(
            cal_id=row.cal_id,
            yeara=row.yeara,
            yearb=row.yearb,
            yearc=row.yearc,
            yeard=row.yeard,
            yeare=row.yeare,            
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
@app.route("/common/list",methods=["GET"])
@jwt_required()
def common_list():  
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']    
    try: 
        catQuery = Cognitivesolutions.query.filter_by(status = 1, added_by=logged_user_email).first()    
        return {
            "success":True,
            "topDuration":catQuery.duration,
            "topEffort":catQuery.initial_effort,
            "topPC":catQuery.program_category,        
            'message':"Showing list."
        },200 
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200

def max_pes(catelog_name):
    catQuery = Cognitivesolutions.query.filter_by(stlc_name = catelog_name).order_by(desc(Cognitivesolutions.effort_savings)).first() 
    return catQuery.effort_savings


#Remove all data
@app.route("/reset",methods=["POST"])
@jwt_required()
def reset_value():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']    
    
    try:
        Calculationyear.query.filter_by(added_by=logged_user_email).delete()
        Calculation.query.filter_by(added_by=logged_user_email).delete()
        Cognitivesolutions.query.filter_by(added_by=logged_user_email).delete()
        db.session.commit()    
        return {
            "success":True,
            "code":200,
            'message':"Data Reset Successfully."
        },200 
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200

#List of all Project Category
@app.route("/aisolution/list",methods=["GET"])

def list_calculation():
    catQuery = Calculation.query.filter_by(status = 1).order_by(asc(Calculation.stlc_name)).all()
    catList = []
    
    for cal in catQuery: 
        calyearQuery = Calculationyear.query.filter_by(cal_id = cal.cal_id).one()
        item={
            'stlc_name': cal.stlc_name,
            'cal_id': cal.cal_id,
            'pod': cal.pod,
            'poa': cal.poa,
            'overr': cal.overr,
            'poaph': cal.poaph,
            'podph': cal.podph,
            'oes': cal.oes,
            'sais': cal.sais,
            'yeara': calyearQuery.yeara,
            'yearb': calyearQuery.yearb,
            'yearc': calyearQuery.yearc,
            'yeard': calyearQuery.yeard,
            'yeare': calyearQuery.yeare,
        }
        catList.append(item)
    return {
        "success":True,
        "code":200,
        "data":catList,
        'message':"All effort list."
    },200 

def update_calculation(colPerRow, allYearValueData,calculationId,logged_user_email):
    tableCol = int(colPerRow)

    yearaVal = 0
    yearbVal = 0
    yearcVal = 0
    yeardVal = 0
    yeareVal = 0 
    cogInfo = Cognitivesolutions.query.filter_by(status = 1).order_by(asc(Cognitivesolutions.catelog)).all()
    slNo = 0
    duplicateIds=[]
    for cInfo in cogInfo:
        
        search = "%{}%".format(cInfo.catelog)
        if(Calculation.query.filter(Calculation.stlc_name == cInfo.stlc_name, Calculation.sais.like(search)).count()>0):
            calInfo = Calculation.query.filter(Calculation.stlc_name == cInfo.stlc_name, Calculation.sais.like(search)).first()
            
            dupCheck = Cognitivesolutions.query.filter_by(solution_category = cInfo.solution_category).count()
            if(dupCheck >1):
                top_eff = Cognitivesolutions.query.filter_by(solution_category = cInfo.solution_category).order_by(desc(Cognitivesolutions.effort_savings)).first() 
               
            startPos = ((int(slNo)*tableCol))
            
            newArr = chunks(allYearValueData,startPos,tableCol)
            
            yearaVal=cInfo.yeara
            yearbVal=cInfo.yearb
            yearcVal=cInfo.yearc
            yeardVal=cInfo.yeard
            yeareVal=cInfo.yeare
            
            calInfo.yeara = yearaVal 
            calInfo.yearb = yearbVal
            calInfo.yearc = yearcVal
            calInfo.yeard = yeardVal
            calInfo.yeare = yeareVal
            db.session.commit()

        slNo=slNo+1

    
    insert_yearwise(logged_user_email)

def insert_yearwise(logged_user_email):
    calInfo = Calculation.query.filter(Calculation.status == 1, Calculation.added_by == logged_user_email).all()
    for cInfo in calInfo:       
        yearaVal = 0
        yearbVal = 0
        yearcVal = 0
        yeardVal = 0
        yeareVal = 0
        saisStr=cInfo.sais
        
        cal_yr_inst = Calculationyear(
            cal_id=cInfo.cal_id,                    
            stlc_name=cInfo.stlc_name,                     
            catelog_name=cInfo.sais,                     
            added_by=logged_user_email,                     
        )
        db.session.add(cal_yr_inst)
        db.session.commit()
        last_id = cal_yr_inst.cal_yr_id  
        calculate_implement(saisStr,float(cInfo.pod),cInfo.overr,last_id)

def chunks(lst, start,num):    
    return [lst[i:i+num] for i in range(start,len(lst),num)]

def unique(list1):
    unique_list = list(dict.fromkeys(list1))
    return unique_list

def validate_implementation(phase_id,allImplementation):  
    Validateimplement.query.delete()
    error ="no_error"
    for pos,phase in enumerate(phase_id):
        imp_inst = Validateimplement(
            phase_id=phase, 
            phase_value=allImplementation[pos],      
            status=1
        )
        db.session.add(imp_inst)
        db.session.commit()
    

    chk_data = Validateimplement.query.filter_by(status =1).group_by(Validateimplement.phase_id).all() 
    
    for data in chk_data:
        stmt = Validateimplement.query.filter_by(phase_id = data.phase_id).all()
        sum=0
        for data_val in stmt:
            sum = sum+data_val.phase_value
        if(sum !=100):
            error = "not_100"        
            return error
    Validateimplement.query.delete()
    return error

def calculate_implement(saisStr, pod, overr, cal_year_id):
    splTxt=saisStr.split(",")

    calVal=0 
    yearaVal = 0
    yearbVal = 0
    yearcVal = 0
    yeardVal = 0
    yeareVal = 0

    yearaSum = 0
    yearbSum = 0
    yearcSum = 0
    yeardSum = 0
    yeareSum = 0
    for txt in splTxt:  
        search_stlc = "%{}%".format(saisStr.strip())
        search_catelog = "%{}%".format(txt.strip())
        if(overr >0):
            cQuery = Cognitivesolutions.query.filter(Cognitivesolutions.catelog.like(search_catelog)).first()
            implementationV = cQuery.implementation
            effotSVal = cQuery.effort_savings

            calVal = (effotSVal*implementationV*pod)/10000
            if(cQuery.yeara > 0):
                yearaVal=(calVal*cQuery.yeara)/(100)
                yearaSum = yearaSum+yearaVal
            if(cQuery.yearb > 0):
                yearbVal=(calVal*cQuery.yearb)/(100)
                yearbSum = yearbSum+yearbVal
            if(cQuery.yearc > 0):
                yearcVal=(calVal*cQuery.yearc)/(100)
                yearcSum = yearcSum+yearcVal
            if(cQuery.yeard > 0):
                yeardVal=(calVal*cQuery.yeard)/(100)
                yeardSum = yeardSum+yeardVal
            if(cQuery.yeare > 0):
                yeareVal=(calVal*cQuery.yeare)/(100)
                yeareSum = yeareSum+yeareVal
            cQuery.yeara_efficiency = yearaVal 
            cQuery.yearb_efficiency = yearbVal
            cQuery.yearc_efficiency = yearcVal
            cQuery.yeard_efficiency = yeardVal
            cQuery.yeare_efficiency = yeareVal
            db.session.commit()

    cQuery = Calculationyear.query.filter_by(cal_yr_id = cal_year_id).first()
    cQuery.yeara = yearaSum 
    cQuery.yearb = yearbSum
    cQuery.yearc = yearcSum
    cQuery.yeard = yeardSum
    cQuery.yeare = yeareSum
    db.session.commit()


#List of all Project Category
@app.route("/efficiency-gain",methods=["POST"])

def efficiency_gain():
    pQuery = Phase.query.filter_by(status = 1).order_by(asc(Phase.phase_id)).all()

    catList = []
    
    future_state_a = 0
    lngTxt = ''
    for phase in pQuery:  
        sumPod = 0 
        result = Calculation.query.filter_by(phase_id = phase.phase_id).order_by(asc(Calculation.phase_id)).all() 
        for res in result:   
            sumPod = sumPod+float(res.pod)

        yearaSum = 0
        yearbSum = 0
        yearcSum = 0
        yeardSum = 0
        yeareSum = 0
        duration = 1
        phaseGain = 0
        exactGain = 0
        cogQuery = Cognitivesolutions.query.filter_by(phase_name=phase.phase_id).all()        
        for cog in cogQuery: 
            yearaSum = yearaSum+float(cog.yeara_efficiency)
            yearbSum = yearbSum+float(cog.yearb_efficiency)
            yearcSum = yearcSum+float(cog.yearc_efficiency)
            yeardSum = yeardSum+float(cog.yeard_efficiency)
            yeareSum = yeareSum+float(cog.yeare_efficiency)

            duration=cog.duration
    
            if(duration ==1):
                phaseGain = sumPod - cog.yeara_efficiency
                # exactGain = sumPod - yearaSum
                
            if(duration ==2):
                phaseGain = sumPod - cog.yearb_efficiency
                # exactGain = sumPod - yearbSum
                
            if(duration ==3):
                phaseGain = sumPod - cog.yearc_efficiency
                # exactGain = sumPod - yearcSum
                
            if(duration ==4):
                phaseGain = sumPod - cog.yeard_efficiency
                # exactGain = sumPod - yeardSum
                
            if(duration ==5):
                phaseGain = sumPod - cog.yeare_efficiency
                exactGain = sumPod - yeareSum

        if(phase.phase_id ==1):
            lngTxt = 'Backlog Refinement, US \n Grooming, Test Planning'
        if(phase.phase_id ==2):
            lngTxt = 'Manual & Auto. Test Design,\n Test Data Setup'
        if(phase.phase_id ==3):
            lngTxt = 'Functional & Regression Test \nExecution & Maint'
        if(phase.phase_id ==4):
            lngTxt = 'Defect Tracking, Test Closure\n & Reporting'
        
        if(duration ==1):
            # phaseGain = sumPod - cog.yeara_efficiency
            exactGain = sumPod - yearaSum
                
        if(duration ==2):
            # phaseGain = sumPod - cog.yearb_efficiency
            exactGain = sumPod
            
        if(duration ==3):
            # phaseGain = sumPod - cog.yearc_efficiency
            exactGain = sumPod - yearcSum
            
        if(duration ==4):
            # phaseGain = sumPod - cog.yeard_efficiency
            exactGain = sumPod - yeardSum
            
        if(duration ==5):
            # phaseGain = sumPod - cog.yeare_efficiency
            exactGain = sumPod - yeareSum

        item={
            'phase_name': phase.phase_name,
            'lngTxt': lngTxt,
            'current_state': sumPod,
            'future_state_yeara': sumPod - yearaSum,
            'future_state_yearb': sumPod - yearbSum,
            'future_state_yearc': sumPod - yearcSum,
            'future_state_yeard': sumPod - yeardSum,
            'future_state_yeare': sumPod - yeareSum,
            'phase_gain': phaseGain,           
            'duration': duration,           
            # 'exact_gain': exactGain,           
        }
        catList.append(item)
    return {
        "success":True,
        "code":200,
        "data":catList,
        'message':"Data listing Successfully."
    },200 

#List of all Project Category
@app.route("/efficiency-gain-ini",methods=["POST"])
def efficiency_gain_ini():
    catList = []
    result1 = Calculation.query.filter_by(phase_id = 1).all() 
    sp_initial = 0  
    for res1 in result1:   
        sp_initial = sp_initial+float(res1.pod)

    result2 = Calculation.query.filter_by(phase_id = 2).all() 
    isd_initial = 0  
    for res2 in result2:
        isd_initial = isd_initial+float(res2.pod)

    result3 = Calculation.query.filter_by(phase_id = 3).all() 
    ise_initial = 0  
    for res3 in result3:
        ise_initial = ise_initial+float(res3.pod)

    result4 = Calculation.query.filter_by(phase_id = 4).all() 
    srr_initial = 0  
    for res4 in result4:
        srr_initial = srr_initial+float(res4.pod)
        item={
            'sp_initial': sp_initial,  
            'isd_initial': isd_initial,  
            'ise_initial': ise_initial,  
            'srr_initial': srr_initial,  
            'qes_initial': '-',  
            'qesph_initial': '-',  
        }
        catList.append(item)
    return {
        "success":True,
        "code":200,
        "data":catList,
        'message':"Data listing Successfully."
    },200 

@app.route("/efficiency-gain-ya",methods=["POST"])
def efficiency_gain_ya():
    resultp = Calculation.query.filter_by(phase_id = 1).first() 
    duration=resultp.ini_duration

    catList = []
    sumPod1 = 0 
    result = Calculation.query.filter_by(phase_id = 1).all() 
    for res in result:   
        sumPod1= sumPod1+float(res.pod)

    sumPod2 = 0 
    result = Calculation.query.filter_by(phase_id = 2).all() 
    for res in result:   
        sumPod2= sumPod2+float(res.pod)
    
    sumPod3 = 0 
    result = Calculation.query.filter_by(phase_id = 3).all() 
    for res in result:   
        sumPod3= sumPod3+float(res.pod)

    sumPod4 = 0 
    result = Calculation.query.filter_by(phase_id = 4).all() 
    for res in result:   
        sumPod4= sumPod4+float(res.pod)

    yearaSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=1).all()        
    for cog in cogQuery: 
        yearaSum = yearaSum+float(cog.yeara_efficiency)
    
    yearbSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=2).all()        
    for cog in cogQuery: 
        yearbSum = yearbSum+float(cog.yeara_efficiency)

    yearcSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=3).all()        
    for cog in cogQuery: 
        yearcSum = yearcSum+float(cog.yearc_efficiency)

    yeardSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=4).all()        
    for cog in cogQuery: 
        yearbSum = yeardSum+float(cog.yeard_efficiency)
    dis='block'
    if(duration >1):
        dis='none'
    item={
        'sp_initial': sumPod1 - yearaSum,  
        'isd_initial':  sumPod2 - yearbSum,  
        'ise_initial': sumPod3 - yearcSum,  
        'srr_initial': sumPod4 - yeardSum,  
        'qes_initial': yearaSum+yearbSum+yearcSum+yeardSum,  
        'qesph_initial': 0,  
        'dis': dis,  
    }
    catList.append(item)
    return {
        "success":True,
        "code":200,
        "data":catList,
        'message':"Data listing Successfully."
    },200 

@app.route("/efficiency-gain-yb",methods=["POST"])
def efficiency_gain_yb():
    resultp = Calculation.query.filter_by(phase_id = 1).first() 
    duration=resultp.ini_duration

    catList = []
    sumPod1 = 0 
    result = Calculation.query.filter_by(phase_id = 1).all() 
    for res in result:   
        sumPod1= sumPod1+float(res.pod)

    sumPod2 = 0 
    result = Calculation.query.filter_by(phase_id = 2).all() 
    for res in result:   
        sumPod2= sumPod2+float(res.pod)
    
    sumPod3 = 0 
    result = Calculation.query.filter_by(phase_id = 3).all() 
    for res in result:   
        sumPod3= sumPod3+float(res.pod)

    sumPod4 = 0 
    result = Calculation.query.filter_by(phase_id = 4).all() 
    for res in result:   
        sumPod4= sumPod4+float(res.pod)

    yearaSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=1).all()        
    for cog in cogQuery: 
        yearaSum = yearaSum+float(cog.yeara_efficiency)
    
    yearbSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=2).all()        
    for cog in cogQuery: 
        yearbSum = yearbSum+float(cog.yearb_efficiency)

    yearcSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=3).all()        
    for cog in cogQuery: 
        yearcSum = yearcSum+float(cog.yearc_efficiency)

    yeardSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=4).all()        
    for cog in cogQuery: 
        yearbSum = yeardSum+float(cog.yeard_efficiency)

    dis='block'
    if(duration >2):
        dis='none'
    item={
        'sp_initial': sumPod1 - yearaSum,  
        'isd_initial':  sumPod2 - yearbSum,  
        'ise_initial': sumPod3 - yearcSum,  
        'srr_initial': sumPod4 - yeardSum,  
        'qes_initial': yearaSum+yearbSum+yearcSum+yeardSum,  
        'qesph_initial': 0,  
        'dis': dis,  
    }
    catList.append(item)
    return {
        "success":True,
        "code":200,
        "data":catList,
        'message':"Data listing Successfully."
    },200 

@app.route("/efficiency-gain-yc",methods=["POST"])
def efficiency_gain_yc():
    resultp = Calculation.query.filter_by(phase_id = 1).first() 
    duration=resultp.ini_duration

    catList = []
    sumPod1 = 0 
    result = Calculation.query.filter_by(phase_id = 1).all() 
    for res in result:   
        sumPod1= sumPod1+float(res.pod)

    sumPod2 = 0 
    result = Calculation.query.filter_by(phase_id = 2).all() 
    for res in result:   
        sumPod2= sumPod2+float(res.pod)
    
    sumPod3 = 0 
    result = Calculation.query.filter_by(phase_id = 3).all() 
    for res in result:   
        sumPod3= sumPod3+float(res.pod)

    sumPod4 = 0 
    result = Calculation.query.filter_by(phase_id = 4).all() 
    for res in result:   
        sumPod4= sumPod4+float(res.pod)

    yearaSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=1).all()        
    for cog in cogQuery: 
        yearaSum = yearaSum+float(cog.yeara_efficiency)
    
    yearbSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=2).all()        
    for cog in cogQuery: 
        yearbSum = yearbSum+float(cog.yearb_efficiency)

    yearcSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=3).all()        
    for cog in cogQuery: 
        yearcSum = yearcSum+float(cog.yearc_efficiency)

    yeardSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=4).all()        
    for cog in cogQuery: 
        yearbSum = yeardSum+float(cog.yeard_efficiency)

    dis='block'
    if(duration >3):
        dis='none'
    item={
        'sp_initial': sumPod1 - yearaSum  ,
        'isd_initial':  sumPod2 - yearbSum,  
        'ise_initial': sumPod3 - yearcSum,  
        'srr_initial': 0,  
        'qes_initial':0,  
        'qesph_initial': 0,  
        'dis': dis,  
    }
    catList.append(item)
    return {
        "success":True,
        "code":200,
        "data":catList,
        'message':"Data listing Successfully."
    },200 

@app.route("/efficiency-gain-yd",methods=["POST"])
def efficiency_gain_yd():
    resultp = Calculation.query.filter_by(phase_id = 1).first() 
    duration=resultp.ini_duration

    catList = []
    sumPod1 = 0 
    result = Calculation.query.filter_by(phase_id = 1).all() 
    for res in result:   
        sumPod1= sumPod1+float(res.pod)

    sumPod2 = 0 
    result = Calculation.query.filter_by(phase_id = 2).all() 
    for res in result:   
        sumPod2= sumPod2+float(res.pod)
    
    sumPod3 = 0 
    result = Calculation.query.filter_by(phase_id = 3).all() 
    for res in result:   
        sumPod3= sumPod3+float(res.pod)

    sumPod4 = 0 
    result = Calculation.query.filter_by(phase_id = 4).all() 
    for res in result:   
        sumPod4= sumPod4+float(res.pod)

    yearaSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=1).all()        
    for cog in cogQuery: 
        yearaSum = yearaSum+float(cog.yeara_efficiency)
    
    yearbSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=2).all()        
    for cog in cogQuery: 
        yearbSum = yearbSum+float(cog.yearb_efficiency)

    yearcSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=3).all()        
    for cog in cogQuery: 
        yearcSum = yearcSum+float(cog.yearc_efficiency)

    yeardSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=4).all()        
    for cog in cogQuery: 
        yearbSum = yeardSum+float(cog.yeard_efficiency)

    dis='block'
    if(duration >4):
        dis='none'
    item={
        'sp_initial': sumPod1 - yearaSum,  
        'isd_initial':  sumPod2 - yearbSum,  
        'ise_initial': sumPod3 - yearcSum,  
        'srr_initial': sumPod4 - yeardSum,  
        'qes_initial': yearaSum+yearbSum+yearcSum+yeardSum,  
        'qesph_initial': 0,  
        'dis': dis,  
    }
    catList.append(item)
    return {
        "success":True,
        "code":200,
        "data":catList,
        'message':"Data listing Successfully."
    },200 

@app.route("/efficiency-gain-ye",methods=["POST"])
def efficiency_gain_ye():
    resultp = Calculation.query.filter_by(phase_id = 1).first() 
    duration=resultp.ini_duration

    catList = []
    sumPod1 = 0 
    result = Calculation.query.filter_by(phase_id = 1).all() 
    for res in result:   
        sumPod1= sumPod1+float(res.pod)

    sumPod2 = 0 
    result = Calculation.query.filter_by(phase_id = 2).all() 
    for res in result:   
        sumPod2= sumPod2+float(res.pod)
    
    sumPod3 = 0 
    result = Calculation.query.filter_by(phase_id = 3).all() 
    for res in result:   
        sumPod3= sumPod3+float(res.pod)

    sumPod4 = 0 
    result = Calculation.query.filter_by(phase_id = 4).all() 
    for res in result:   
        sumPod4= sumPod4+float(res.pod)

    yearaSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=1).all()        
    for cog in cogQuery: 
        yearaSum = yearaSum+float(cog.yeara_efficiency)
    
    yearbSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=2).all()        
    for cog in cogQuery: 
        yearbSum = yearbSum+float(cog.yearb_efficiency)

    yearcSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=3).all()        
    for cog in cogQuery: 
        yearcSum = yearcSum+float(cog.yearc_efficiency)

    yeardSum = 0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=4).all()        
    for cog in cogQuery: 
        yearbSum = yeardSum+float(cog.yeard_efficiency)

    dis='block'
    if(duration >5):
        dis='none'
    item={
        'sp_initial': sumPod1 - yearaSum,  
        'isd_initial':  sumPod2 - yearbSum,  
        'ise_initial': sumPod3 - yearcSum,  
        'srr_initial': sumPod4 - yeardSum,  
        'qes_initial': yearaSum+yearbSum+yearcSum+yeardSum,  
        'qesph_initial': 0,  
        'dis': dis,  
    }
    catList.append(item)
    return {
        "success":True,
        "code":200,
        "data":catList,
        'message':"Data listing Successfully."
    },200 


@app.route("/efficiency-gain-new",methods=["POST"])
@jwt_required()
def efficiency_gain_new():
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

@app.route("/dummy",methods=["POST"])

def dummy_list():
    pQuery = Phase.query.filter_by(status = 1).order_by(asc(Phase.phase_id)).all()
    catList = []  
    for phase in pQuery:         
        item={
            'name': phase.phase_name,
            'id': phase.phase_id,            
        }
        catList.append(item)
    return catList

def calculate_current_state(phase_id,logged_user_email):
    sumPod = 0
    result = Calculation.query.filter_by(phase_id = phase_id, added_by = logged_user_email).all() 
    for res in result:   
        sumPod = sumPod+float(res.pod)
    return sumPod

def calculate_sp(phase_id,logged_user_email):
    sumPod = 0
    result = Calculation.query.filter_by(phase_id = phase_id, added_by = logged_user_email).all() 
    for res in result:   
        sumPod = sumPod+float(res.pod)

    yearaSum =0
    cogQuery = Cognitivesolutions.query.filter_by(phase_name=phase_id, added_by = logged_user_email).all()        
    for cog in cogQuery: 
        yearaSum = yearaSum+float(cog.yeara_efficiency)
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