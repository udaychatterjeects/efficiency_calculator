import datetime
from app import db, app, request, jwt
from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, JWTManager, get_jwt_identity, jwt_required
from sqlalchemy import asc, desc
from extras.utilities import encrypt_password, password_check
from models.User import User, Usertoken
from models.Effortsdistribution import Effortsdistribution, Applicablecognitivesolutions
from models.Project import Project

SUPERADMIN_EMAIL = 'super@cog.com'


def _require_superadmin():
    tokenDetails = get_jwt_identity()
    return tokenDetails.get('role') == 'superadmin'


# ── Seed superadmin (call once) ──────────────────────────────────────────────

@app.route('/superadmin/seed', methods=['POST'])
def seed_superadmin():
    try:
        if User.query.filter_by(email=SUPERADMIN_EMAIL).first():
            return jsonify({"success": False, "message": "Superadmin already exists."}), 200
        currentTime = datetime.datetime.now()
        password = encrypt_password('super@cog.com123')
        superadmin = User(
            email=SUPERADMIN_EMAIL,
            password=password,
            firstname='Super',
            lastname='Admin',
            user_role='superadmin',
            email_confirmed=1,
            created_at=currentTime,
        )
        db.session.add(superadmin)
        db.session.commit()

        # Seed master Effortsdistribution data
        _seed_master_efforts()
        # Seed master Solutions data
        _seed_master_solutions()

        return jsonify({"success": True, "message": "Superadmin created and master data seeded."}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


def _seed_master_efforts():
    if Effortsdistribution.query.filter_by(added_by=SUPERADMIN_EMAIL).count() > 0:
        return
    default_efforts = [
        {'phase': 1, 'stlc_name': 'Sprint Planning & Strategizing', 'cat_name': 'Greenfield Digital Transformation', 'standard_breakup': 5},
        {'phase': 2, 'stlc_name': 'In Sprint Test Design (Manual)', 'cat_name': 'Greenfield Digital Transformation', 'standard_breakup': 15},
        {'phase': 2, 'stlc_name': 'In Sprint Test Design (Automation)', 'cat_name': 'Greenfield Digital Transformation', 'standard_breakup': 30},
        {'phase': 3, 'stlc_name': 'In-Sprint Test Execution (Environment Management)', 'cat_name': 'Greenfield Digital Transformation', 'standard_breakup': 2},
        {'phase': 3, 'stlc_name': 'In Sprint Test Execution (Test Data)', 'cat_name': 'Greenfield Digital Transformation', 'standard_breakup': 2},
        {'phase': 2, 'stlc_name': 'In-Sprint Test Design (Regression Maintenance)', 'cat_name': 'Greenfield Digital Transformation', 'standard_breakup': 5},
        {'phase': 3, 'stlc_name': 'In-Sprint Test Execution (Functional)', 'cat_name': 'Greenfield Digital Transformation', 'standard_breakup': 21},
        {'phase': 3, 'stlc_name': 'In-Sprint Test Execution (Regression)', 'cat_name': 'Greenfield Digital Transformation', 'standard_breakup': 5},
        {'phase': 3, 'stlc_name': 'In-Sprint Test Execution (NFT)', 'cat_name': 'Greenfield Digital Transformation', 'standard_breakup': 5},
        {'phase': 3, 'stlc_name': 'In-Sprint Test Execution (Others)', 'cat_name': 'Greenfield Digital Transformation', 'standard_breakup': 5},
        {'phase': 3, 'stlc_name': 'In-Sprint Test Execution (Defect Management)', 'cat_name': 'Greenfield Digital Transformation', 'standard_breakup': 3},
        {'phase': 4, 'stlc_name': 'Sprint Review & Retrospection', 'cat_name': 'Greenfield Digital Transformation', 'standard_breakup': 2},
        {'phase': 1, 'stlc_name': 'Sprint Planning & Strategizing', 'cat_name': 'Platform Upgrade and Modernization', 'standard_breakup': 3},
        {'phase': 2, 'stlc_name': 'In Sprint Test Design (Manual)', 'cat_name': 'Platform Upgrade and Modernization', 'standard_breakup': 15},
        {'phase': 2, 'stlc_name': 'In Sprint Test Design (Automation)', 'cat_name': 'Platform Upgrade and Modernization', 'standard_breakup': 22},
        {'phase': 3, 'stlc_name': 'In-Sprint Test Execution (Environment Management)', 'cat_name': 'Platform Upgrade and Modernization', 'standard_breakup': 2},
        {'phase': 3, 'stlc_name': 'In Sprint Test Execution (Test Data)', 'cat_name': 'Platform Upgrade and Modernization', 'standard_breakup': 2},
        {'phase': 2, 'stlc_name': 'In-Sprint Test Design (Regression Maintenance)', 'cat_name': 'Platform Upgrade and Modernization', 'standard_breakup': 9},
        {'phase': 3, 'stlc_name': 'In-Sprint Test Execution (Functional)', 'cat_name': 'Platform Upgrade and Modernization', 'standard_breakup': 20},
        {'phase': 3, 'stlc_name': 'In-Sprint Test Execution (Regression)', 'cat_name': 'Platform Upgrade and Modernization', 'standard_breakup': 10},
        {'phase': 3, 'stlc_name': 'In-Sprint Test Execution (NFT)', 'cat_name': 'Platform Upgrade and Modernization', 'standard_breakup': 6},
        {'phase': 3, 'stlc_name': 'In-Sprint Test Execution (Others)', 'cat_name': 'Platform Upgrade and Modernization', 'standard_breakup': 6},
    ]
    for e in default_efforts:
        db.session.add(Effortsdistribution(
            phase=e['phase'],
            stlc_name=e['stlc_name'],
            cat_name=e['cat_name'],
            standard_breakup=e['standard_breakup'],
            override_breakup=e['standard_breakup'],
            status=1,
            added_by=SUPERADMIN_EMAIL,
        ))
    db.session.commit()


def _seed_master_solutions():
    if Applicablecognitivesolutions.query.filter_by(added_by=SUPERADMIN_EMAIL).count() > 0:
        return
    default_solutions = [
        {
            'catelog': 'UI Script Generation Acceleration via GitHub Copilot',
            'stlc_name': 'In Sprint Test Design (Automation)',
            'solution_category': 'External',
            'solution_type': 'Generative AI',
            'license_type': 'Licensed',
            'licsensing_cost': 19,
            'frequency': 'Month',
            'effort_savings': 25,
            'short_desc': 'Microsoft GitHub CoPilot is a code assist platform which can aid in converting user stories into BDD feature files and also accelerate UI script development.',
            'adoption_per': 80,
        },
        {
            'catelog': 'Automation Script Migration',
            'stlc_name': 'In Sprint Test Design (Automation)',
            'solution_category': 'Cognizant: Prototype',
            'solution_type': 'Generative AI',
            'license_type': 'Free',
            'licsensing_cost': 0,
            'frequency': 'Month',
            'effort_savings': 15,
            'short_desc': 'GenAI based solution which can help in automation testing framework or codebase migration from one solution to another.',
            'adoption_per': 30,
        },
        {
            'catelog': 'Neuro AI for QA : API Script Generation',
            'stlc_name': 'In Sprint Test Design (Automation)',
            'solution_category': 'Cognizant: Industrialized',
            'solution_type': 'Generative AI',
            'license_type': 'Free',
            'licsensing_cost': 0,
            'frequency': 'Month',
            'effort_savings': 15,
            'short_desc': 'Gen AI based solution integrated with client specific foundational models which can create service test automation scripts following client specific framework.',
            'adoption_per': 30,
        },
    ]
    for s in default_solutions:
        db.session.add(Applicablecognitivesolutions(
            catelog=s['catelog'],
            stlc_name=s['stlc_name'],
            solution_category=s['solution_category'],
            solution_type=s['solution_type'],
            license_type=s['license_type'],
            licsensing_cost=s['licsensing_cost'],
            frequency=s['frequency'],
            effort_savings=s['effort_savings'],
            short_desc=s['short_desc'],
            adoption_per=s['adoption_per'],
            preferred_tool='Y',
            status=1,
            added_by=SUPERADMIN_EMAIL,
        ))
    db.session.commit()


# ── Users management ─────────────────────────────────────────────────────────

@app.route('/superadmin/users', methods=['GET'])
@jwt_required()
def superadmin_list_users():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    users = User.query.filter(User.user_role != 'superadmin').order_by(asc(User.user_id)).all()
    return jsonify([
        dict(
            userId=u.user_id,
            email=u.email,
            firstname=u.firstname or '',
            lastname=u.lastname or '',
            role=u.user_role,
            status=u.email_confirmed,
            createdAt=str(u.created_at),
        )
        for u in users
    ]), 200


@app.route('/superadmin/user/add', methods=['POST'])
@jwt_required()
def superadmin_add_user():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    data = request.get_json()
    email = data['email']
    raw_password = data['password']
    firstname = data.get('firstname', '')
    lastname = data.get('lastname', '')
    role = data.get('role', 'user')
    currentTime = datetime.datetime.now()

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already exists."}), 400

    password = encrypt_password(raw_password)
    new_user = User(
        email=email, password=password, firstname=firstname, lastname=lastname,
        user_role=role, email_confirmed=0, created_at=currentTime,
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": True, "message": "User added successfully."}), 201


@app.route('/superadmin/user/activate', methods=['POST'])
@jwt_required()
def superadmin_activate_user():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    data = request.get_json()
    email = data['email']
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    activating = user.email_confirmed == 0
    user.email_confirmed = 1 if activating else 0
    db.session.commit()

    if activating:
        # Clone master STLC activities
        master_efforts = Effortsdistribution.query.filter_by(added_by=SUPERADMIN_EMAIL).all()
        if master_efforts:
            Effortsdistribution.query.filter_by(added_by=email).delete()
            db.session.commit()
            for r in master_efforts:
                db.session.add(Effortsdistribution(
                    phase=r.phase, stlc_name=r.stlc_name, cat_name=r.cat_name,
                    standard_breakup=r.standard_breakup, override_breakup=r.override_breakup,
                    status=r.status, added_by=email,
                ))
            db.session.commit()

        # Clone master AI solutions
        master_solutions = Applicablecognitivesolutions.query.filter_by(added_by=SUPERADMIN_EMAIL).all()
        if master_solutions:
            Applicablecognitivesolutions.query.filter_by(added_by=email).delete()
            db.session.commit()
            for s in master_solutions:
                db.session.add(Applicablecognitivesolutions(
                    catelog=s.catelog, stlc_name=s.stlc_name,
                    solution_category=s.solution_category, solution_type=s.solution_type,
                    license_type=s.license_type, licsensing_cost=s.licsensing_cost,
                    frequency=s.frequency, effort_savings=s.effort_savings,
                    short_desc=s.short_desc, adoption_per=s.adoption_per,
                    preferred_tool=s.preferred_tool, status=s.status, added_by=email,
                ))
            db.session.commit()

    action = "activated" if activating else "deactivated"
    return jsonify({"success": True, "message": f"User {action} successfully."}), 200


# ── STLC Activities CRUD ─────────────────────────────────────────────────────

@app.route('/superadmin/activities', methods=['GET'])
@jwt_required()
def superadmin_list_activities():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    rows = Effortsdistribution.query.filter_by(added_by=SUPERADMIN_EMAIL, status=1) \
        .order_by(asc(Effortsdistribution.phase), asc(Effortsdistribution.stlc_name)).all()
    return jsonify([
        dict(id=r.e_dis_id, phase=r.phase, stlcName=r.stlc_name,
             catName=r.cat_name, standardBreakup=r.standard_breakup)
        for r in rows
    ]), 200


@app.route('/superadmin/activity/add', methods=['POST'])
@jwt_required()
def superadmin_add_activity():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    d = request.get_json()
    db.session.add(Effortsdistribution(
        phase=d['phase'], stlc_name=d['stlcName'],
        cat_name=d.get('catName', 'Greenfield Digital Transformation'),
        standard_breakup=d['standardBreakup'], override_breakup=d['standardBreakup'],
        status=1, added_by=SUPERADMIN_EMAIL,
    ))
    db.session.commit()
    return jsonify({"success": True, "message": "Activity added."}), 200


@app.route('/superadmin/activity/update', methods=['POST'])
@jwt_required()
def superadmin_update_activity():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    d = request.get_json()
    row = Effortsdistribution.query.filter_by(e_dis_id=d['id'], added_by=SUPERADMIN_EMAIL).first()
    if not row:
        return jsonify({"success": False, "message": "Not found."}), 404
    row.phase = d.get('phase', row.phase)
    row.stlc_name = d.get('stlcName', row.stlc_name)
    row.cat_name = d.get('catName', row.cat_name)
    row.standard_breakup = d.get('standardBreakup', row.standard_breakup)
    row.override_breakup = d.get('standardBreakup', row.override_breakup)
    db.session.commit()
    return jsonify({"success": True, "message": "Activity updated."}), 200


@app.route('/superadmin/activity/delete', methods=['POST'])
@jwt_required()
def superadmin_delete_activity():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    d = request.get_json()
    row = Effortsdistribution.query.filter_by(e_dis_id=d['id'], added_by=SUPERADMIN_EMAIL).first()
    if not row:
        return jsonify({"success": False, "message": "Not found."}), 404
    db.session.delete(row)
    db.session.commit()
    return jsonify({"success": True, "message": "Activity deleted."}), 200


# ── AI Solutions Catalogue CRUD ───────────────────────────────────────────────

@app.route('/superadmin/solutions', methods=['GET'])
@jwt_required()
def superadmin_list_solutions():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    rows = Applicablecognitivesolutions.query.filter_by(added_by=SUPERADMIN_EMAIL, status=1) \
        .order_by(asc(Applicablecognitivesolutions.catelog)).all()
    return jsonify([
        dict(
            id=s.sol_id, catelog=s.catelog, stlcName=s.stlc_name,
            solutionCategory=s.solution_category, solutionType=s.solution_type,
            licenseType=s.license_type, licsensingCost=s.licsensing_cost,
            frequency=s.frequency, effortSavings=s.effort_savings,
            shortDesc=s.short_desc, adoptionPer=s.adoption_per,
        )
        for s in rows
    ]), 200


@app.route('/superadmin/solution/add', methods=['POST'])
@jwt_required()
def superadmin_add_solution():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    d = request.get_json()
    db.session.add(Applicablecognitivesolutions(
        catelog=d['catelog'], stlc_name=d['stlcName'],
        solution_category=d.get('solutionCategory', ''),
        solution_type=d.get('solutionType', ''),
        license_type=d.get('licenseType', ''),
        licsensing_cost=d.get('licsensingCost', 0),
        frequency=d.get('frequency', ''),
        effort_savings=d.get('effortSavings', 0),
        short_desc=d.get('shortDesc', ''),
        adoption_per=d.get('adoptionPer', 0),
        preferred_tool='Y', status=1, added_by=SUPERADMIN_EMAIL,
    ))
    db.session.commit()
    return jsonify({"success": True, "message": "Solution added."}), 200


@app.route('/superadmin/solution/update', methods=['POST'])
@jwt_required()
def superadmin_update_solution():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    d = request.get_json()
    s = Applicablecognitivesolutions.query.filter_by(sol_id=d['id'], added_by=SUPERADMIN_EMAIL).first()
    if not s:
        return jsonify({"success": False, "message": "Not found."}), 404
    s.catelog = d.get('catelog', s.catelog)
    s.stlc_name = d.get('stlcName', s.stlc_name)
    s.solution_category = d.get('solutionCategory', s.solution_category)
    s.solution_type = d.get('solutionType', s.solution_type)
    s.license_type = d.get('licenseType', s.license_type)
    s.licsensing_cost = d.get('licsensingCost', s.licsensing_cost)
    s.frequency = d.get('frequency', s.frequency)
    s.effort_savings = d.get('effortSavings', s.effort_savings)
    s.short_desc = d.get('shortDesc', s.short_desc)
    s.adoption_per = d.get('adoptionPer', s.adoption_per)
    db.session.commit()
    return jsonify({"success": True, "message": "Solution updated."}), 200


@app.route('/superadmin/solution/delete', methods=['POST'])
@jwt_required()
def superadmin_delete_solution():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    d = request.get_json()
    s = Applicablecognitivesolutions.query.filter_by(sol_id=d['id'], added_by=SUPERADMIN_EMAIL).first()
    if not s:
        return jsonify({"success": False, "message": "Not found."}), 404
    db.session.delete(s)
    db.session.commit()
    return jsonify({"success": True, "message": "Solution deleted."}), 200


# ── Categories (Project types) CRUD ──────────────────────────────────────────

@app.route('/superadmin/categories', methods=['GET'])
@jwt_required()
def superadmin_list_categories():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    rows = Project.query.order_by(asc(Project.project_name)).all()
    return jsonify([
        dict(id=r.project_id, name=r.project_name, status=r.status)
        for r in rows
    ]), 200


@app.route('/superadmin/category/add', methods=['POST'])
@jwt_required()
def superadmin_add_category():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    d = request.get_json()
    name = (d.get('name') or '').strip()
    if not name:
        return jsonify({"success": False, "message": "Category name is required."}), 400
    if Project.query.filter_by(project_name=name).first():
        return jsonify({"success": False, "message": "Category already exists."}), 400
    db.session.add(Project(project_name=name, status=1))
    db.session.commit()
    return jsonify({"success": True, "message": "Category added."}), 200


@app.route('/superadmin/category/update', methods=['POST'])
@jwt_required()
def superadmin_update_category():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    d = request.get_json()
    row = Project.query.filter_by(project_id=d['id']).first()
    if not row:
        return jsonify({"success": False, "message": "Not found."}), 404
    row.project_name = d.get('name', row.project_name)
    row.status = d.get('status', row.status)
    db.session.commit()
    return jsonify({"success": True, "message": "Category updated."}), 200


@app.route('/superadmin/category/delete', methods=['POST'])
@jwt_required()
def superadmin_delete_category():
    if not _require_superadmin():
        return jsonify({"success": False, "message": "Unauthorized."}), 403
    d = request.get_json()
    row = Project.query.filter_by(project_id=d['id']).first()
    if not row:
        return jsonify({"success": False, "message": "Not found."}), 404
    db.session.delete(row)
    db.session.commit()
    return jsonify({"success": True, "message": "Category deleted."}), 200
