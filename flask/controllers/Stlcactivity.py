from app import db, app, request, jwt
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.Effortsdistribution import *
from sqlalchemy import asc, desc

# List of all Phases
@app.route("/activity/list", methods=["GET"])
@jwt_required()
def list_activity():
        userDetails = get_jwt_identity()    
        logged_user_email = userDetails['user']

    # try:
        phaseQuery = Effortsdistribution.query.filter_by(added_by = logged_user_email).order_by(asc(Effortsdistribution.stlc_name))
        phaseList = [
             
            dict(
                e_dis_id=row.e_dis_id,
                stlc_name= row.stlc_name,
            )
            for row in phaseQuery
        ]
        return phaseList, 200
    # except:
    #     return jsonify({
    #         "success": False,
    #         "code": 500,
    #         "message": "System encountered an unexpected problem and is being tracked.",
    #     }), 200

# Add a new Phase
@app.route("/activity/add", methods=["POST"])
@jwt_required()
def add_activity():
    userDetails = get_jwt_identity()    
    logged_user_email = userDetails['user']

    data = request.get_json()
    stlcPhase	 = data['stlcPhase']
    stlcName	 = data['stlcName']
    standardBreakup	 = data['standardBreakup']

    # return {
    #     "success": False,
    #     "code": 400,
    #     "stlcPhase": stlcPhase,
    #     "stlcName": stlcName,
    #     "standardBreakup": standardBreakup
    # }, 400

    
    try:
        if not stlcName:
            return {
                "success": False,
                "code": 400,
                "message": "Missing STLC Activity name."
            }, 400

        new_stlc_activity = Effortsdistribution(phase=stlcPhase,
                          stlc_name=stlcName,
                          cat_name='Greenfield Digital Transformation',
                          standard_breakup=standardBreakup,
                          override_breakup=standardBreakup,
                          added_by=logged_user_email)
        db.session.add(new_stlc_activity)
        db.session.commit()

        return {
            "success": True,
            "code": 200,
            "message": "STLC Activity added successfully."
        }, 200
    except:
        return jsonify({
            "success": False,
            "code": 500,
            "message": "System encountered an unexpected problem and is being tracked.",
        }), 200

# # Edit an existing Phase
# @app.route("/phase/edit", methods=["PUT"])
# @jwt_required()
# def edit_phase():
#     userDetails = get_jwt_identity()
#     try:
#         data = request.get_json()
#         phaseId = data['phaseId']
#         phaseName = data['phaseName']

#         phaseInfo = Phase.query.filter_by(phase_id=phaseId).first()
#         if not phaseInfo:
#             return {
#                 "success": False,
#                 "code": 400,
#                 "message": "Invalid phase."
#             }, 400

#         phaseInfo.phase_name = phaseName
#         db.session.commit()

#         return {
#             "success": True,
#             "code": 200,
#             "message": "Phase updated successfully."
#         }, 200
#     except:
#         return jsonify({
#             "success": False,
#             "code": 500,
#             "message": "System encountered an unexpected problem and is being tracked.",
#         }), 200

# # Delete a Phase
# @app.route("/phase/delete/<int:phaseId>", methods=["DELETE"])
# @jwt_required()
# def delete_phase(phaseId):
#     userDetails = get_jwt_identity()
#     try:
#         phaseData = Phase.query.filter_by(phase_id=phaseId).first()
#         if not phaseData:
#             return {
#                 "success": False,
#                 "code": 400,
#                 "message": "Invalid phase."
#             }, 400

#         db.session.delete(phaseData)
#         db.session.commit()

#         return {
#             "success": True,
#             "code": 200,
#             "message": "Phase deleted successfully."
#         }, 200
#     except:
#         return jsonify({
#             "success": False,
#             "code": 500,
#             "message": "System encountered an unexpected problem and is being tracked.",
#         }), 200