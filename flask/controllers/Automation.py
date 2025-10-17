from app import db, app, request, jwt
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.Effortsdistribution import *
from extras.utils import get_response
from sqlalchemy import asc, desc
# import pandas as pd
from tabulate import tabulate
import json

@app.route("/automation/target", methods=["POST"])
@jwt_required()
def target_adoption():
    # Get the logged-in user's email from JWT token
    user_details = get_jwt_identity()
    logged_user_email = user_details['user']
    try:
        # Parse incoming JSON payload
        data = request.get_json()

        # Extract required fields from the payload
        all_implementation = data['allImplementation']
        solu_id = data['solu_id']    
        stlc_names = data['stlc_name']

        # Remove duplicate STLC activity names
        unique_stlc_activities = list(set(stlc_names))

        # Initialize total activity savings
        activity_sum = 0
        effort_saving = 0

        # Iterate over each unique STLC activity
        for stlc_name in unique_stlc_activities:
            # Derive max solution for the activity
            max_solutions = derived_max_solution(logged_user_email, stlc_name, all_implementation)

            # Get the maximum saving entry from the derived solutions
            max_saving_entry = get_max_saving(max_solutions)
            # print(max_saving_entry)

            effort_breakup = get_effort_breakup(stlc_name)
            # Accumulate the savings
            activity_sum += max_saving_entry['saving']
            effort_saving +=(max_saving_entry['saving']*effort_breakup)/100
        # Return success response with calculated activity sum
        return {
            "success": True,
            "code": 200,
            "activitySum": effort_saving,
            "message": "Target value generated successfully."
        }, 200

    except Exception as e:
        # Handle unexpected errors gracefully
        return jsonify({
            "success": False,
            "code": 500,
            "message": f"System encountered an unexpected problem: {str(e)}",
        }), 500


@app.route("/automation/senddata", methods=["POST"])
@jwt_required()
def aumation_data():
        userDetails = get_jwt_identity()
        logged_user_email = userDetails['user']
    # try: 
        data = request.get_json()
        initialEffort = data['initialEffort']
        duration = int(data['duration'])
        #Adoption Planned Array
        allImplementation = data['allImplementation']
        allYearValueData = data['allYearValueData']
        phase_id = data['phase_id']
        solu_id = data['solu_id']
        stlc_name_arr = data['stlc_name']
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

        Calculationyear.query.filter_by(added_by=logged_user_email).delete()
        Calculation.query.filter_by(added_by=logged_user_email).delete()
       
        cogSolQuery = Cognitivesolutions.query.filter_by(
            added_by = logged_user_email
        ).order_by(asc(Cognitivesolutions.sol_id))
        stlc_cnt=0
        for cog in cogSolQuery: 
            catQuery = Effortsdistribution.query.filter_by(
                added_by=logged_user_email,
                stlc_name=stlc_name_arr[stlc_cnt]
            ).first()
            if(int(duration)==1):
                start=stlc_cnt*duration

                yeara=allYearValueData[start]
                yearb=''
                yearc=''
                yeard=''
                yeare=''
            if(int(duration)==2):
                start=stlc_cnt*duration

                yeara=allYearValueData[start]
                yearb=allYearValueData[start+1]
                yearc=''
                yeard=''
                yeare=''
            if(int(duration)==3):
                start=stlc_cnt*duration
                yeara=allYearValueData[start]
                yearb=allYearValueData[start+1]
                yearc=allYearValueData[start+2]
                yeard=''
                yeare=''
            if(int(duration)==4):
                start=stlc_cnt*duration

                yeara=allYearValueData[start]
                yearb=allYearValueData[start+1]
                yearc=allYearValueData[start+2]
                yeard=allYearValueData[start+3]
                yeare=''
            if(int(duration)==5):
                start=stlc_cnt*duration

                yeara=allYearValueData[start]
                yearb=allYearValueData[start+1]
                yearc=allYearValueData[start+2]
                yeard=allYearValueData[start+3]
                yeare=allYearValueData[start+4]
            
            max_solutions = derived_max_solution(logged_user_email,stlc_name_arr[stlc_cnt],allImplementation)  
            max_saving_entry = get_max_saving(max_solutions)
            cogSolQueryUpdate = Cognitivesolutions.query.filter_by(
                sol_id=solu_id[stlc_cnt], 
                added_by = logged_user_email
            ).first()     
          
            cogSolQueryUpdate.effort_breakup = catQuery.override_breakup 
            cogSolQueryUpdate.derived_saving = max_saving_entry['saving']
            cogSolQueryUpdate.implementation = allImplementation[stlc_cnt]
            cogSolQueryUpdate.yeara = yeara
            cogSolQueryUpdate.yearb = yearb
            cogSolQueryUpdate.yearc = yearc
            cogSolQueryUpdate.yeard = yeard
            cogSolQueryUpdate.yeare = yeare
            db.session.commit()
            stlc_cnt=stlc_cnt+1
            # print(yeara)
        catQuery = Effortsdistribution.query.filter_by(added_by=logged_user_email).order_by(asc(Effortsdistribution.phase))
        catList = []
        catelog_name=''
        sol_eff_saving=0
        x=0

        yeara=0
        yearb=0
        yearc=0
        yeard=0
        yeare=0
        cnt=0
        col=0
        col=duration
        row=int(len(allYearValueData)/duration)
        effCnt=0
        update_table(logged_user_email)
        for cat in catQuery:  
            effCnt=effCnt+1        
            sol_eff_saving=cat.standard_breakup            
            solutions_name = derived_solution_name(logged_user_email,cat.stlc_name)     
            max_solutions = derived_max_solution(logged_user_email,cat.stlc_name,allImplementation)  
            max_saving_entry = get_max_saving(max_solutions)           
            yeara=0
            yearb=0
            yearc=0
            yeard=0
            yeare=0 
            if(max_saving_entry['stlc_name']==cat.stlc_name):
                if(int(duration)==1):
                    start=(max_saving_entry['solution_id']-1)*col

                    yeara=allYearValueData[start]
                    yearb=''
                    yearc=''
                    yeard=''
                    yeare=''
                if(int(duration)==2):
                    start=(max_saving_entry['solution_id']-1)*col

                    yeara=allYearValueData[start]
                    yearb=allYearValueData[start+1]
                    yearc=''
                    yeard=''
                    yeare=''
                if(int(duration)==3):
                    start=(max_saving_entry['solution_id']-1)*col
                    yeara=allYearValueData[start]
                    yearb=allYearValueData[start+1]
                    yearc=allYearValueData[start+2]
                    yeard=''
                    yeare=''
                if(int(duration)==4):
                    start=(max_saving_entry['solution_id']-1)*col

                    yeara=allYearValueData[start]
                    yearb=allYearValueData[start+1]
                    yearc=allYearValueData[start+2]
                    yeard=allYearValueData[start+3]
                    yeare=''
                if(int(duration)==5):
                    start=(max_saving_entry['solution_id']-1)*col

                    yeara=allYearValueData[start]
                    yearb=allYearValueData[start+1]
                    yearc=allYearValueData[start+2]
                    yeard=allYearValueData[start+3]
                    yeare=allYearValueData[start+4]
            phaseQuery = Phase.query.filter_by(phase_id=cat.phase).first()
            item = {
                'phase': phaseQuery.phase_name,
                'stlcName': cat.stlc_name,
                'standardBreakup': sol_eff_saving,
                'derived_solution_name': solutions_name.replace(",", "",1),
                'derived_effort_savings': max_saving_entry['saving'],
                'initialEffort': initialEffort,
                'duration': duration,
                'yeara': yeara,
                'yearb': yearb,
                'yearc': yearc,
                'yeard': yeard,
                'yeare': yeare,
                # 'adoption_yeara': yeare,
                # 'adoption_yearb': yeare,
                # 'adoption_yearc': yeare,
                # 'adoption_yeard': yeare,
                # 'adoption_yeare': yeare,
            }
            catList.append(item)             
        markdown_table = tabulate(catList, headers="keys", tablefmt="simple")       
        # print(yeara)
        # print(yearb)
        with open("extras/Prompt.v1.1.txt") as f:
            content = f.read()

        prompt = content.format(table_a=markdown_table)
        # with open("extras/output_prompt.txt", "w") as f:
        #     f.write(prompt)
        output = get_response(prompt, response_format={"type": "json_object"})       
        outputJson = extract_and_parse_json_block(output)       
        for i in outputJson['data']:            
            phaseQuery = Phase.query.filter_by(phase_id=cat.phase).first()   
            catQuery = Effortsdistribution.query.filter_by(added_by=logged_user_email,stlc_name=i['stlcName']).first() 
            
            # cogSolFetch = Cognitivesolutions.query.filter_by(sol_id=catQuery.phase, added_by = logged_user_email).first()
            # print(i['yeara_adoption'])
            podphval = (float(i['pod'])*float(initialEffort))/100
            oesphval = (float(i['overr'])*float(initialEffort))/100
            poaphval=podphval-oesphval
            print(oesphval)  
            # exit
            # Insert into calculation table 
            cal_inst = Calculation(
                stlc_name=i['stlcName'], 
                phase_id=catQuery.phase,   
                # phase_id=1, 
                sais=i['derived_solution_name'],
                pod=i['pod'], 
                poa=i['pod']-i['overr'], 
                overr=i['overr'], 
                podph=podphval, 
                poaph=poaphval, 
                oes=oesphval,
                status=1,
                category_name="Greenfield Digital Transformation",
                ini_duration=int(duration),
                ini_day=int(initialEffort),
                added_by=logged_user_email,
            )
            db.session.add(cal_inst)
            db.session.commit()

            cQuery = Calculation.query.filter_by(added_by = logged_user_email, status=1).order_by(desc(Calculation.cal_id)).first()
            last_inserted_id = cQuery.cal_id
            
            # cogSolFetch = Cognitivesolutions.query.filter_by(sol_id=catQuery.phase, added_by = logged_user_email).first()

            # print(i['derived_solution_name'])
            # print(cogSolFetch.yeara)
            # print(cogSolFetch.yearb)
            # print(cogSolFetch.yearc)
            # print(cogSolFetch.yeard)
            # print(cogSolFetch.yeare)
            # exit()
            # yeara_effi=(i['overr']*cogSolFetch.yeara)/100
            # yearb_effi=(i['overr']*cogSolFetch.yearb)/100
            # yearc_effi=(i['overr']*cogSolFetch.yearc)/100
            # yeard_effi=(i['overr']*cogSolFetch.yeard)/100
            # yeare_effi=(i['overr']*cogSolFetch.yeare)/100
            # print(i)
            yearaVal = (i['overr']*i['yeara_adoption'])/100 if i.get('yeara_adoption') else 0            
            yearbVal = (i['overr']*i['yearb_adoption']) / 100 if i.get('yearb_adoption') else 0 
            yearcVal = (i['overr']*i['yearc_adoption']) / 100 if i.get('yearc_adoption') else 0 
            yeardVal = (i['overr']*i['yeard_adoption']) / 100 if i.get('yeard_adoption') else 0 
            yeareVal = (i['overr']*i['yeare_adoption']) / 100 if i.get('yeare_adoption') else 0 
            # print("================")
            # print(yearaVal)
            # print(yearbVal)
            # print(yearcVal)
            # print(yeardVal)
            # print(yeareVal)
            # print("================")
            cal_yr_inst = Calculationyear(
                cal_id=last_inserted_id,  
                stlc_name=i['stlcName'],                     
                catelog_name=i['derived_solution_name'],   
                # yeara = (i['yeara_adoption'] * int(i['overr'])) / 100 if i.get('yeara_adoption') else 0,             
                yeara = yearaVal,             
                yearb = yearbVal,                     
                yearc = yearcVal,                         
                yeard = yeardVal,          
                yeare = yeareVal,          
                # yeare=i['yeare_adoption'],                     
                added_by=logged_user_email,                     
            )
            db.session.add(cal_yr_inst)
            db.session.commit()

            yeara_adoption=0
            yearb_adoption=0
            yearc_adoption=0
            yeard_adoption=0
            yeare_adoption=0
            cogSolQuery = Cognitivesolutions.query.filter_by(stlc_name=i['stlcName'], added_by = logged_user_email).first()
            if cogSolQuery is not None:
                if(duration ==1):
                    yeara_adoption=i.get('yeara_adoption')
                if(duration ==2):
                    yeara_adoption=i.get('yeara_adoption')
                    yearb_adoption=i.get('yearb_adoption')
                if(duration ==3):
                    yeara_adoption=i.get('yeara_adoption')
                    yearb_adoption=i.get('yearb_adoption')
                    yearc_adoption=i.get('yearc_adoption')
                if(duration ==4):
                    yeara_adoption=i.get('yeara_adoption')
                    yearb_adoption=i.get('yearb_adoption')
                    yearc_adoption=i.get('yearc_adoption')
                    yeard_adoption=i.get('yeard_adoption')
                if(duration ==5):
                    yeara_adoption=i.get('yeara_adoption')
                    yearb_adoption=i.get('yearb_adoption')
                    yearc_adoption=i.get('yearc_adoption')
                    yeard_adoption=i.get('yeard_adoption')
                    yeare_adoption=i.get('yeare_adoption') 
                      
                cogSolQuery.yeara_efficiency = yeara_adoption
                cogSolQuery.yearb_efficiency = yearb_adoption
                cogSolQuery.yearc_efficiency = yearc_adoption
                cogSolQuery.yeard_efficiency = yeard_adoption
                cogSolQuery.yeare_efficiency = yeare_adoption
                db.session.commit()           
        
        return {
            "success": True,
            "code": 200,
            "outputJson": outputJson,
            'message': "Calculation generated successfully."
        }, 200

    # except Exception as e:
    #     return jsonify({
    #         "success": False,
    #         "code": 500,
    #         "message": f"System encountered an unexpected problem: {str(e)}",
    #     }), 500


def get_phase_id(phase):
    phaseQuery = Phase.query.filter_by(phase_name=phase).first()
    # print(phaseQuery.phase_id)
    # exit()
    return phaseQuery.phase_id
def derived_max_solution(logged_user_email,stlc_name,adoption_val):   
    solCnt = Cognitivesolutions.query.filter_by(
            stlc_name=stlc_name,
            status=1,
            added_by=logged_user_email
        ).count()
    maxList=[]
    if(solCnt>1):
        prev_saving=0
        new_saving=0
        catQuery = Cognitivesolutions.query.filter_by(
            stlc_name=stlc_name,
            status=1,
            added_by=logged_user_email
        ).all()
        for cog in catQuery: 
            sol =  cog.sol_id
            saving =  round((float(cog.effort_savings)*float(adoption_val[sol-1])/100),2)      

            item = {
                    'saving': saving,
                    'solution_id': sol,
                    'stlc_name': cog.stlc_name,
                }
            maxList.append(item)
    elif solCnt==1:
        catQuery = Cognitivesolutions.query.filter_by(
            stlc_name=stlc_name,
            status=1,
            added_by=logged_user_email
        ).first()
        sol =  catQuery.sol_id
        new_saving =  round((float(catQuery.effort_savings)*float(adoption_val[sol-1])/100),2)
        item = {
                'saving': new_saving,
                'solution_id': sol,
                'stlc_name': catQuery.stlc_name,
            }
        maxList.append(item)
    else:
        new_saving =  0
        item = {
                'saving': new_saving,
                'solution_id': 0,
                'stlc_name': 'NA',
            }
        maxList.append(item)

    return maxList

def derived_solution_name(logged_user_email,stlc_name):
    catelog_name=''
    catQuery = Cognitivesolutions.query.filter_by(
        stlc_name=stlc_name,
        status=1,
        added_by=logged_user_email
    ).order_by(asc(Cognitivesolutions.catelog)).all()
    for cog in catQuery: 
        catelog_name = catelog_name+", "+cog.catelog

    return catelog_name

def extract_and_parse_json_block(text):
    # Extract JSON code block using regex
    try:
        data = json.loads(text)
        # print("Parsed JSON object:", data)
        return data
    except json.JSONDecodeError as e:
        print("Error parsing JSON:", e)
        return None
    

def get_max_saving(data):
    """
    This function takes a list of dictionaries with 'saving' as string values
    and returns the dictionary with the maximum saving.
    """
    return max(data, key=lambda x: float(x['saving']))

def get_effort_breakup(stlc_name):
    efoQuery=Effortsdistribution.query.filter(
        Effortsdistribution.stlc_name.like(stlc_name), 
        Effortsdistribution.status.like(1)
    ).first()
    return efoQuery.override_breakup

def update_table(logged_user):
    cogSolQuery = Cognitivesolutions.query.filter_by(
        added_by = logged_user
    ).order_by(asc(Cognitivesolutions.sol_id))
    adoption = 0
    old_sol_id = 0
    sum_of_saving = 0
    for cog in cogSolQuery:
        adoption = (cog.effort_savings*cog.implementation)/100
        cgS = Cognitivesolutions.query.filter_by(
            sol_id=cog.sol_id, 
            added_by = logged_user
        ).first()
        cgS.sol_saving = adoption
        db.session.commit()
        update_total(logged_user,cog.sol_id,adoption,cog.stlc_name)
       
def update_total(logged_user,sol_id,adoption,stlc_name):
    sum_saving=0
    solCnt = Cognitivesolutions.query.filter_by(
            stlc_name=stlc_name,
            status=1,
            added_by=logged_user
        ).count()
    maxList=[]
    # sum_saving=0
    if(solCnt>1):
        catQuery = Cognitivesolutions.query.filter_by(
            stlc_name=stlc_name,
            status=1,
            added_by=logged_user
        )
        sum_saving=0
        for cog in catQuery: 
            sum_saving=sum_saving+cog.sol_saving
        catQueryUp = Cognitivesolutions.query.filter_by( 
            sol_id=sol_id,
            stlc_name=stlc_name,
            status=1,
            added_by=logged_user
        ).first()
        catQueryUp.total_saving =sum_saving

    elif solCnt==1:
        catQuery = Cognitivesolutions.query.filter_by(
            stlc_name=stlc_name,
            status=1,
            added_by=logged_user
        ).first()
        catQuery.total_saving =adoption
        db.session.commit()
    else:
        print("C")