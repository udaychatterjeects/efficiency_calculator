from app import db, app, request, jwt
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.Effortsdistribution import Phase
from sqlalchemy import asc, desc

# List of all Phases
@app.route("/phase/list", methods=["GET"])
@jwt_required()
def list_phases():
    userDetails = get_jwt_identity()
    try:
        phaseQuery = Phase.query.order_by(desc(Phase.phase_id)).all()
        phaseList = [
            dict(
                phase_id=row.phase_id,
                phase_name=row.phase_name,
                # Add other relevant fields as necessary
            )
            for row in phaseQuery
        ]
        return phaseList, 200
    except:
        return jsonify({
            "success": False,
            "code": 500,
            "message": "System encountered an unexpected problem and is being tracked.",
        }), 200

# Add a new Phase
@app.route("/phase/add", methods=["POST"])
@jwt_required()
def add_phase():
    userDetails = get_jwt_identity()    
    logged_user_email = userDetails['user']

    data = request.get_json()
    stlcPhase = data['stlcPhase']
    try:
        if not stlcPhase:
            return {
                "success": False,
                "code": 400,
                "message": "Missing phase name."
            }, 400

        new_phase = Phase(phase_name=stlcPhase)
        db.session.add(new_phase)
        db.session.commit()

        return {
            "success": True,
            "code": 200,
            "message": "Phase added successfully."
        }, 200
    except:
        return jsonify({
            "success": False,
            "code": 500,
            "message": "System encountered an unexpected problem and is being tracked.",
        }), 200

# Edit an existing Phase
@app.route("/phase/edit", methods=["PUT"])
@jwt_required()
def edit_phase():
    userDetails = get_jwt_identity()
    try:
        data = request.get_json()
        phaseId = data['phaseId']
        phaseName = data['phaseName']

        phaseInfo = Phase.query.filter_by(phase_id=phaseId).first()
        if not phaseInfo:
            return {
                "success": False,
                "code": 400,
                "message": "Invalid phase."
            }, 400

        phaseInfo.phase_name = phaseName
        db.session.commit()

        return {
            "success": True,
            "code": 200,
            "message": "Phase updated successfully."
        }, 200
    except:
        return jsonify({
            "success": False,
            "code": 500,
            "message": "System encountered an unexpected problem and is being tracked.",
        }), 200

# Delete a Phase
@app.route("/phase/delete/<int:phaseId>", methods=["DELETE"])
@jwt_required()
def delete_phase(phaseId):
    userDetails = get_jwt_identity()
    try:
        phaseData = Phase.query.filter_by(phase_id=phaseId).first()
        if not phaseData:
            return {
                "success": False,
                "code": 400,
                "message": "Invalid phase."
            }, 400

        db.session.delete(phaseData)
        db.session.commit()

        return {
            "success": True,
            "code": 200,
            "message": "Phase deleted successfully."
        }, 200
    except:
        return jsonify({
            "success": False,
            "code": 500,
            "message": "System encountered an unexpected problem and is being tracked.",
        }), 200