import datetime
from app import db, app, request, jwt
from flask import Flask, request,jsonify
from flask_jwt_extended import create_access_token, JWTManager, get_jwt_identity, jwt_required, current_user
from sqlalchemy import asc, desc
from extras.utilities import *
from extras.utils import *
from models.Effortsdistribution import *
from sqlalchemy import func
import math
from controllers.Defaultdata import insert_default_solution


#List of all Project Category
@app.route("/category/list",methods=["GET"])

def list_category():
    try:     
        
        catQuery = Effortsdistribution.query.group_by(Effortsdistribution.cat_name).order_by(asc(Effortsdistribution.cat_name))
        catList = [
            dict(
                catId=row.e_dis_id,
                catName=row.cat_name
            )
            for row in catQuery
        ]        
         
        return catList,200
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200

#List of all STLC Phases
@app.route("/phase/list", methods=["GET"])
@jwt_required()
def list_phases():
    try:
        phases = Phase.query.filter_by(status=1).order_by(asc(Phase.phase_id)).all()
        phaseList = [
            dict(phase_id=p.phase_id, phase_name=p.phase_name)
            for p in phases
        ]
        return jsonify(phaseList), 200
    except:
        return jsonify({"success": False, "message": "Error fetching phases."}), 200

#List of all STLC Activities (distinct stlc_name for logged-in user)
@app.route("/activity/list", methods=["GET"])
@jwt_required()
def list_activities():
    try:
        tokenDetails = get_jwt_identity()
        logged_user_email = tokenDetails['user']
        activities = Effortsdistribution.query.filter_by(
            added_by=logged_user_email, status=1
        ).order_by(asc(Effortsdistribution.stlc_name)).all()
        seen = set()
        activityList = []
        for a in activities:
            if a.stlc_name not in seen:
                seen.add(a.stlc_name)
                activityList.append({'stlc_name': a.stlc_name})
        return jsonify(activityList), 200
    except:
        return jsonify({"success": False, "message": "Error fetching activities."}), 200

#Add a new STLC Activity
@app.route("/activity/add", methods=["POST"])
@jwt_required()
def add_activity():
    try:
        tokenDetails = get_jwt_identity()
        logged_user_email = tokenDetails['user']
        data = request.get_json()
        stlc_phase = data['stlcPhase']
        stlc_name = data['stlcName']
        standard_breakup = data['standardBreakup']
        new_activity = Effortsdistribution(
            phase=stlc_phase,
            stlc_name=stlc_name,
            cat_name='Greenfield Digital Transformation',
            standard_breakup=standard_breakup,
            override_breakup=standard_breakup,
            status=1,
            added_by=logged_user_email,
        )
        db.session.add(new_activity)
        db.session.commit()
        return jsonify({"success": True, "code": 200, "message": "Activity added successfully."}), 200
    except:
        return jsonify({"success": False, "code": 500, "message": "System encountered an unexpected problem."}), 200

#List of all Project Category
@app.route("/stlcbycategory",methods=["POST"])
@jwt_required()
def list_category_by_stlc():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']

    data = request.get_json()
    category_name = data['catname']   

    catQuery = Effortsdistribution.query.filter_by(cat_name = category_name, added_by = logged_user_email).order_by(asc(Effortsdistribution.phase))
    catList = []
    for cat in catQuery:
        phaseQuery = Phase.query.filter_by(phase_id = cat.phase).first()
        rowspan=1
        if(phaseQuery.phase_name == "In-Sprint Design"):
            rowspan=3
        if(phaseQuery.phase_name == "In-Sprint Execution"):
            rowspan=7
        item={
            'eDisId': cat.e_dis_id,
            'catName': cat.cat_name,
            'phase': phaseQuery.phase_name,
            'phase_id': phaseQuery.phase_id,
            'stlcName': cat.stlc_name,
            'standardBreakup': cat.standard_breakup,
            'overrideBreakup': cat.override_breakup,
            'stlstatuscName': cat.status,
            'category_name': category_name,
            'rowspan': rowspan,
        }
        catList.append(item)
    return {
        "success":True,
        "code":200,
        "data":catList,
        'message':"All effort list."
    },200  
       
# #Function to create Squad
@app.route('/effortsdistribution/add', methods=['POST'])

def create_ed_application():    
    data = request.get_json()
    try:
        eDisId = data['eDisId']
        overrideValue = data['overrideValue']
        standardValue = data['standardValue']
        selectedCategory = data['selectedCategory']

        sum=0
        for inde,x in enumerate(overrideValue):        
            # Check if provided value is numeric or not
            if not x.isnumeric():
                return {
                    "success":False,
                    "code":400,
                    'message':"You have to provide only numeric value."
                },400
            # value will be within 0,100  range
            if (int(x) >100 or int(x) <0):
                return {
                    "success":False,
                    "code":400,
                    'message':"Provide value between 0 to 100."
                },400
            # Check if sum of value is 100
            finalValue = standardValue[inde]
            if(standardValue[inde] != x):
                finalValue = x
            else:
                finalValue = standardValue[inde]
            sum = sum+int(finalValue)
       
        if (sum !=100):
            return {
                "success":False,
                "code":400,
                'message':"Total value should be 100."
            },400
        for cnt,val in enumerate(overrideValue):
            effortsDistributionInfo = Effortsdistribution.query.filter_by(e_dis_id=eDisId[cnt]).first()
            effortsDistributionInfo.override_breakup = val
            db.session.commit()
        return {
            "success":True,
            "code":200,
            'message':"Data updated successfully."
        },200 
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200
    
# #Function to create Squad
@app.route('/solution/add', methods=['POST'])
@jwt_required()
def add_solution(): 
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']   
    data = request.get_json()
    # try:
    catelog = data['catelog']
    stlc_name = data['stlc']
    solution_category = data['category']
    license_type = data['licenseType']
    licsensing_cost = data['licsensingCost']
    frequency = data['frequency']
    program_category = data['programCategory']
    initial_effort = data['initialEffort']
    duration = data['duration']
    effort_savings = data['effort']
    recisedEffort = data['recisedEffort']
    added_by = logged_user_email

    search_stlc = "%{}%".format(stlc_name)
    search_cat = "%{}%".format(program_category)    
    efoQuery=Effortsdistribution.query.filter(Effortsdistribution.stlc_name.like(search_stlc), Effortsdistribution.cat_name.like(search_cat)).first()
    phase_name = efoQuery.phase

    if not recisedEffort:
        effortVal=effort_savings        
    else:
        effortVal=recisedEffort
    status = 1
    new_application = Cognitivesolutions(
            catelog=catelog,
            stlc_name=stlc_name,
            phase_name=phase_name,
            solution_category=solution_category,
            license_type=license_type,
            licsensing_cost=licsensing_cost,
            frequency=frequency,
            effort_savings=effortVal,
            program_category=program_category,
            initial_effort=initial_effort,
            duration=duration,
            status=status,
            added_by=added_by
        )
    db.session.add(new_application)
    db.session.commit()
    return {
        "success":True,
        "code":200,
        'message':"Data updated successfully."
    },200 
    
# #Function to create Squad
@app.route('/solution/reset', methods=['POST'])
@jwt_required()
def reset_solution(): 
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']
    Cognitivesolutions.query.filter_by(added_by=logged_user_email).delete()
    db.session.commit()    
    return {
        "success":True,
        "code":200,
        'message':"Data Reset Successfully."
    },200 
    
#List of all Project Category
@app.route("/solution/list",methods=["GET"])
@jwt_required()
def list_solution():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']
   
    catQuery = Applicablecognitivesolutions.query.filter_by(added_by=logged_user_email).order_by(Applicablecognitivesolutions.catelog).all()
    catList = [
        dict(
            solId=row.sol_id,
            catelog=row.catelog,
            stlcName=row.stlc_name,
            solutionCategory=row.solution_category,
            licenseType=row.license_type,
            solutionType=row.solution_type,
            licsensingCost=row.licsensing_cost,
            frequency=row.frequency,
            effortSavings=str(row.effort_savings)+"%",
            preferredTool=row.preferred_tool,
            short_desc=row.short_desc,
            # adoption_yeara=row.adoption_yeara,
            # adoption_yearb=row.adoption_yearb,
            # adoption_yearc=row.adoption_yearc,
            # adoption_yeard=row.adoption_yeard,
            # adoption_yeare=row.adoption_yeare,
            adoption=row.adoption_per,
        )
        for row in catQuery
    ]        
        
    return catList,200

#List of all Project Category
@app.route("/solution/recommendation",methods=["POST"])
@jwt_required()
def reclist_solution():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']

    catQuery = Applicablecognitivesolutions.query.filter_by(status=1, added_by=logged_user_email).order_by(Applicablecognitivesolutions.catelog).all()
    catList = [
        dict(
            # solId=row.sol_id,
            solutionName=row.catelog,
            stlcName=row.stlc_name,
            # solutionCategory=row.solution_category,
            # licenseType=row.license_type,
            # solutionType=row.solution_type,
            # licsensingCost=row.licsensing_cost,
            # frequency=row.frequency,
            # effortSavings=str(row.effort_savings)+"%",
            # preferredTool=row.preferred_tool,
            shortDesc=row.short_desc,
            # adoption_yeara=10,
            # adoption_yearb=50,
            # adoption_yearc=100,
            # adoption_yeard=100,
            # adoption_yeare=100,
        )
        for row in catQuery
    ]        
        
    return catList,200

# #Function to create Squad
@app.route('/mastersolution/add', methods=['POST'])
@jwt_required()
def add_mastersolution():  
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']

    data = request.get_json()    

    stlc_name = data['stlc']
    catelog = data['catelog']
    licsensing_cost = data['licsensingCost']
    effort_savings = data['effort']
    solution_category = data['category']
    license_type = data['licenseType']
    frequency = data['frequency']
    solution_type = data['solutionType']
    desc = data['desc']
    adoption = data['adoption']
    added_by = logged_user_email
    preferred_tool = "Y"
    status = 1  

    new_application = Applicablecognitivesolutions(        
            catelog           = catelog,
            stlc_name         = stlc_name,
            solution_type = solution_type,
            solution_category = solution_category,
            license_type      = license_type,
            licsensing_cost   = licsensing_cost,
            frequency         = frequency,
            effort_savings    = effort_savings,
            preferred_tool    = preferred_tool,
            status            = status,
            short_desc            = desc,
            adoption_per            = adoption,
            added_by            = added_by,
        )
    db.session.add(new_application)
    db.session.commit()
    return {
        "success":True,
        "code":200,
        'message':"Data added successfully."
    },200 
   

# #Function to create Squad
@app.route('/mastersolution/update', methods=['POST'])

def update_solution():    
    data = request.get_json()

    catelog = data['catelog']
    stlc_name = data['stlc']
    solution_category = data['category']
    license_type = data['licenseType']
    licsensing_cost = data['licsensingCost']
    frequency = data['frequency']
    effort_savings = data['effort']
    sol_id = data['sid']
    solution_type = data['solutionType']    
    short_desc = data['desc']    
      
    # yeara = data['yeara']    
    # yearb = data['yearb']    
    # yearc = data['yearc']    
    # yeard = data['yeard']    
    # yeare = data['yeare']  
    adoption = data['adoption']  
    
    solutionInfo = Applicablecognitivesolutions.query.filter_by(sol_id=sol_id).first()
    solutionInfo.catelog = catelog
    solutionInfo.stlc_name = stlc_name
    solutionInfo.solution_category = solution_category
    solutionInfo.license_type = license_type
    solutionInfo.licsensing_cost = licsensing_cost
    solutionInfo.solution_type = solution_type
    solutionInfo.frequency = frequency
    solutionInfo.effort_savings = effort_savings
    solutionInfo.short_desc = short_desc
    # solutionInfo.adoption_yeara = yeara
    # solutionInfo.adoption_yearb = yearb
    # solutionInfo.adoption_yearc = yearc
    # solutionInfo.adoption_yeard = yeard
    # solutionInfo.adoption_yeare = yeare
    solutionInfo.adoption_per = adoption
    db.session.commit()
    return {
            "success":True,
            "code":200,
            'message':"Data updated successfully.",
            # 'yearb':yearb,
        },200
   
#Delete application
@app.route("/solution/delete",methods=["POST"])

def delete_solution():
    data = request.get_json()

    sol_id = data['id']

    try:
        Applicablecognitivesolutions.query.filter_by(sol_id = sol_id).delete()
        db.session.commit()
        return {
                "success":True,
                "code":200,
                'message':"Solution deleted successfully."
        },200
    except:
        return jsonify({
            "success":False,
            "code":500,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200

#Delete application
@app.route("/cogsolution/delete",methods=["POST"])

def delete_cogsolution():
    data = request.get_json()

    sol_id = data['id']

    try:
        Cognitivesolutions.query.filter_by(sol_id = sol_id).delete()
        db.session.commit()
        return {
                "success":True,
                "code":200,
                "sol_id":sol_id,
                'message':"Solution deleted successfully."
        },200
    except:
        return jsonify({
            "success":False,
            "code":500,
            # "sol_id":sol_id,
            "message":"System encountered an unexpected problem and is being tracked.",
        }),200
#List of all Project Category
@app.route("/solution/stlc",methods=["GET"])
@jwt_required()
def list_solutionstlc():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']
    catQuery = Applicablecognitivesolutions.query.filter_by(status=1, added_by=logged_user_email).order_by(Applicablecognitivesolutions.stlc_name).all()
    catList=[]
    for cat in catQuery:
        if(Cognitivesolutions.query.filter_by(catelog=cat.catelog,stlc_name=cat.stlc_name, added_by=logged_user_email).count()<=0):
            items={
                "solId":cat.sol_id,
                "stlc_name":cat.stlc_name,
                "catelog":cat.catelog, 
            }
            catList.append(items)
        
    return catList,200

#List of all Project Category
@app.route("/solution/stlcdata",methods=["POST"])

def list_stlcdata():
    data = request.get_json()

    sol_id = data['id']
   
    catQuery = Applicablecognitivesolutions.query.filter_by(sol_id=sol_id).all()
    catList = [
        dict(
            sol_id=row.sol_id,
            catelog=row.catelog,
            stlc_name=row.stlc_name,
            solution_category=row.solution_category,
            license_type=row.license_type,
            licsensing_cost=row.licsensing_cost,
            frequency=row.frequency,
            effort_savings=row.effort_savings,
            preferred_tool=row.preferred_tool,
        )
        for row in catQuery
    ]        
        
    return catList,200

#List of all Project Category
@app.route("/cognitivesolution/list",methods=["GET"])
@jwt_required()
def list_cognitive_solution():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']
    
    catQuery = Cognitivesolutions.query.filter_by(status=1, added_by=logged_user_email).order_by(Cognitivesolutions.phase_name).all()
   
    catList = []   
    bgColor='#000000'   
    for cat in catQuery:
        if(cat.phase_name == "1"):
            bgColor='#ffffff'                
        if(cat.phase_name == "2"):
            bgColor='#ffffff'
            
        if(cat.phase_name == "3"):
            bgColor='#ffffff'
            
        if(cat.phase_name == "4"):
            bgColor='#ffffff'

        # print("bgColor: "+str(bgColor)+"  phase_name: "+str(cat.phase_name))
        acatQuery = Applicablecognitivesolutions.query.filter_by(catelog=cat.catelog).first()
        item={
            'bgColor': bgColor,
            'solId': cat.sol_id,
            'catelog': cat.catelog,
            'phase_name': cat.phase_name,
            'phase_id': cat.phase_name,
            'stlcName': cat.stlc_name,
            'solutionCategory': cat.solution_category,
            'licenseType': cat.license_type,
            'licsensingCost': cat.licsensing_cost,
            'frequency': cat.frequency,
            'effortSavings': cat.effort_savings,
            'preferredTool': cat.preferred_tool,
            'status': cat.status,
            'duration': cat.duration,
            'program_category': cat.program_category,
            'initial_effort': cat.initial_effort,
            'adoption_per': acatQuery.adoption_per,
            'source_data': cat.source_data,
        }
        catList.append(item)
    
    return catList,200


#List of all Project Category
@app.route("/cognitivesolution/graph",methods=["GET"])
@jwt_required()
def graph_cognitive_solution():
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user']  

    hasCat = Calculationyear.query.filter(Calculationyear.catelog_name !='', Calculationyear.added_by == logged_user_email).all()
    includeIds =[]
    for noValId in hasCat:
        includeIds.append(noValId.cal_id)
    catQuery = Cognitivesolutions.query.filter_by(status=1, added_by = logged_user_email).order_by(Cognitivesolutions.catelog).all()
    catList = [] 
    indivisual_effort = 0   

    yeara_gain = 0
    yearb_gain = 0
    yearc_gain = 0
    yeard_gain = 0
    yeare_gain = 0
    for cog in catQuery: 
        indivisual_effort = cog.effort_savings
        
        total_effort=0 
        cogQuery = Cognitivesolutions.query.filter_by(stlc_name=cog.stlc_name, added_by = logged_user_email).all()  
        for cq in cogQuery:  
            total_effort = cq.effort_savings+total_effort
        if(Calculationyear.query.filter(Calculationyear.stlc_name==cog.stlc_name, Calculationyear.added_by == logged_user_email,  Calculationyear.cal_id.in_(includeIds)).count()>0):
            calyearQuery = Calculationyear.query.filter_by(stlc_name=cog.stlc_name, added_by = logged_user_email).first()  
       
            if(calyearQuery.yeara >0):
                yeara_gain = (indivisual_effort*calyearQuery.yeara)/total_effort
            if(calyearQuery.yearb >0):
                yearb_gain = (indivisual_effort*calyearQuery.yearb)/total_effort
            if(calyearQuery.yearc >0):
                yearc_gain = (indivisual_effort*calyearQuery.yearc)/total_effort
            if(calyearQuery.yeard >0):
                yeard_gain = (indivisual_effort*calyearQuery.yeard)/total_effort
            if(calyearQuery.yeare >0):
                yeare_gain = (indivisual_effort*calyearQuery.yeare)/total_effort

            if(cog.duration =="1"):
                final_value=yeara_gain
            if(cog.duration =="2"):
                final_value=yearb_gain
            if(cog.duration =="3"):
                final_value=yearc_gain
            if(cog.duration =="4"):
                final_value=yeard_gain
            if(cog.duration =="5"):
                final_value=yeare_gain
            item={
                'solId': cog.sol_id,
                'label': cog.catelog,
                'value': final_value,
            }
            catList.append(item)
        
    return catList,200
    

#List of all Project Category
@app.route("/stlc/bargraph",methods=["GET"])

def get_bargraph():
    catQuery = Calculation.query.filter_by(status = 1).order_by(asc(Calculation.stlc_name)).all()
    podList = []
    poaList = []
    stlcList = []
    dataList = []
    for cal in catQuery:        
        calyearQuery = Calculationyear.query.filter_by(cal_id = cal.cal_id, stlc_name=cal.stlc_name).all()
        for calyear in calyearQuery: 
            stlcList.append(cal.stlc_name)
            podList.append(float(cal.pod))
            poaList.append(float(cal.poa))
    return {
        "success":True,
        "code":200,
        "data":dataList,
        "pod":podList,
        "poa":poaList,
        "stlc":stlcList,
        'message':"All effort list."
    },200 

# #List of all Project Category
@app.route("/cognitivesolutioncal/list",methods=["GET"])
@jwt_required()
def list_cognitive_solution_calc():  
    tokenDetails = get_jwt_identity()
    logged_user_email = tokenDetails['user'] 
    
    catQuery = Cognitivesolutions.query.filter_by(status=1,added_by=logged_user_email).order_by(asc(Cognitivesolutions.phase_name)).all()
    catList = [] 
    for cog in catQuery:    
        item={
            'solId': cog.sol_id,
            'stlcName': cog.stlc_name,
            'catelog': cog.catelog,
            'effortSavings':cog.effort_savings,
            'yeara':cog.yeara_efficiency,
            'yearb':cog.yearb_efficiency,
            'yearc':cog.yearc_efficiency,
            'yeard':cog.yeard_efficiency,
            'yeare':cog.yeare_efficiency,
        }
        catList.append(item)
        
    return catList,200


@app.route('/reset/stlc', methods=['POST'])
@jwt_required()
def reset_stlc():  
        tokenDetails = get_jwt_identity()
        logged_user_email = tokenDetails['user']

        efforInfo = Effortsdistribution.query.filter_by(added_by=logged_user_email).all()
        for effort in efforInfo:
            eUpdateInfo = Effortsdistribution.query.filter_by(e_dis_id=effort.e_dis_id).first()
            eUpdateInfo.override_breakup = effort.standard_breakup
            db.session.commit()
        return {
            "success":True,
            "code":200,
            'message':"Data Reset Successfully."
        },200 


@app.route('/reset/solutions', methods=['POST'])
@jwt_required()
def reset_solutions():  
        tokenDetails = get_jwt_identity()
        logged_user_email = tokenDetails['user']
        # return {
        #     "success":True,
        #     "code":200,
        #     "logged_user_email":logged_user_email,
        #     'message':"Data Reset Successfully."
        # },200 
        Applicablecognitivesolutions.query.filter_by(added_by=logged_user_email).delete()
        add_def_solutions = insert_default_solution(logged_user_email)
        return {
            "success":True,
            "code":200,
            'message':"Data Reset Successfully."
        },200 
        # efforInfo = Effortsdistribution.query.filter_by(added_by=logged_user_email).all()
        # for effort in efforInfo:
        #     eUpdateInfo = Effortsdistribution.query.filter_by(e_dis_id=effort.e_dis_id).first()
        #     eUpdateInfo.override_breakup = effort.standard_breakup
        #     db.session.commit()
        # return {
        #     "success":True,
        #     "code":200,
        #     'message':"Data Reset Successfully."
        # },200 

@app.route('/recommendation', methods=['POST'])
@jwt_required()
def recommendation():  
        data = request.get_json()
        tokenDetails = get_jwt_identity()
        logged_user_email = tokenDetails['user']
        # print(logged_user_email)
       
        input_description = data["inputDesc"]
        solution_details = data["solDetails"]
        solution_data = parse_solution_details(solution_details)
        all_solutions = solution_data["Solution Name"]
        prompt = get_prompt(input_description, solution_data)
        response = get_response(prompt)
        app.logger.info(f"GenAI response:\n{response}")
        solutionList = [solution for solution in all_solutions if solution in response]
        # return {"message": "success", "solutions": solutionList, "sCount": len(solutionList)}, 200
        # except Exception as error:
        #     return {"message": "error", "error": str(error)}, 500
        # print(len(solutionList))
        if(len(solutionList) <=0):
            return jsonify({
                "success":False,
                "code":500,
                "message":"No recommendation found.",
                "sCount": len(solutionList)
            }),201
        Cognitivesolutions.query.delete()
        db.session.commit()  
        for solName in solutionList:
            catelog = solName
            solutionInfo = Applicablecognitivesolutions.query.filter_by(catelog=catelog).first()
            stlc_name = solutionInfo.stlc_name
            solution_category = solutionInfo.solution_category
            license_type = solutionInfo.license_type
            licsensing_cost = solutionInfo.licsensing_cost
            frequency = solutionInfo.frequency
            program_category = data['programCategory']
            initial_effort = data['initialEffort']
            duration = data['duration']            
            status = 1
            effortVal = solutionInfo.effort_savings
            search_stlc = "%{}%".format(stlc_name)
            search_cat = "%{}%".format(program_category)    
            efoQuery=Effortsdistribution.query.filter(Effortsdistribution.stlc_name.like(search_stlc), Effortsdistribution.cat_name.like(search_cat)).first()
            phase_name = efoQuery.phase
            new_application = Cognitivesolutions(
                catelog=catelog,
                stlc_name=stlc_name,
                phase_name=phase_name,
                solution_category=solution_category,
                license_type=license_type,
                licsensing_cost=licsensing_cost,
                frequency=frequency,
                effort_savings=effortVal,
                program_category=program_category,
                initial_effort=initial_effort,
                duration=duration,
                status=status,
                source_data='A',
                added_by=logged_user_email
            )
            db.session.add(new_application)
            db.session.commit()
        return {
            "success":True,
            "code":200,
            'message':"Data updated successfully."
        },200 
   