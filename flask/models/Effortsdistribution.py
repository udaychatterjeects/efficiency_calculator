from app import db, app
from sqlalchemy.orm import backref

class Effortsdistribution(db.Model):
    __tablename__ = 'effortsdistribution'
    e_dis_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    phase=db.Column(db.String(100), nullable=False)
    stlc_name=db.Column(db.String(100), nullable=False)
    cat_name=db.Column(db.String(100), nullable=False)
    standard_breakup=db.Column(db.Integer, nullable=True)
    override_breakup=db.Column(db.Integer, nullable=True)
    status=db.Column(db.Integer, default=1, nullable=False)
    default=db.Column(db.Integer, default=0, nullable=False)
    added_by=db.Column(db.String(100), nullable=True)
with app.app_context():
    db.create_all() 

class Applicablecognitivesolutions(db.Model):
    __tablename__ = 'applicablecognitivesolution'
    sol_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    catelog=db.Column(db.String(100), nullable=False)
    stlc_name=db.Column(db.String(100), nullable=False)
    solution_category=db.Column(db.String(100), nullable=True)
    solution_type=db.Column(db.String(100), nullable=True)
    license_type=db.Column(db.String(100), nullable=True)
    licsensing_cost=db.Column(db.String(100), nullable=True)
    frequency=db.Column(db.String(100), nullable=True)
    effort_savings=db.Column(db.Integer, nullable=True)
    vector=db.Column(db.String(100), nullable=True)
    short_desc=db.Column(db.String(100), nullable=True)
    adoption_per=db.Column(db.Integer, default=0, nullable=False)
    preferred_tool=db.Column(db.String(100), nullable=True)
    status=db.Column(db.Integer, default=1, nullable=False)
    added_by=db.Column(db.String(100), nullable=True)

with app.app_context():
    db.create_all()

class Cognitivesolutions(db.Model):
    __tablename__ = 'cognitivesolution'
    sol_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    catelog=db.Column(db.String(100), nullable=False)
    phase_name=db.Column(db.String(100), nullable=False)
    stlc_name=db.Column(db.String(100), nullable=False)
    solution_category=db.Column(db.String(100), nullable=True)
    license_type=db.Column(db.String(100), nullable=True)
    licsensing_cost=db.Column(db.String(100), nullable=True)
    frequency=db.Column(db.String(100), nullable=True)
    effort_savings=db.Column(db.Integer, nullable=True)
    derived_saving=db.Column(db.Integer, nullable=True)
    effort_breakup=db.Column(db.Integer, nullable=True)
    total_saving=db.Column(db.Integer, default=0, nullable=True)
    implementation=db.Column(db.Integer, default=0, nullable=True)
    target_efficiency=db.Column(db.Integer, default=0, nullable=True)
    sol_saving=db.Column(db.Integer, default=0, nullable=True)
    preferred_tool=db.Column(db.String(100), nullable=True)
    # implementation=db.Column(db.Integer, default=0, nullable=False)
    program_category=db.Column(db.String(100), nullable=True)
    initial_effort=db.Column(db.String(100), nullable=True)
    # target_efficiency=db.Column(db.String(100), nullable=True)
    duration=db.Column(db.String(100), nullable=True)
    yeara=db.Column(db.Integer, default=0, nullable=False)
    yearb=db.Column(db.Integer, default=0, nullable=False)
    yearc=db.Column(db.Integer, default=0, nullable=False)
    yeard=db.Column(db.Integer, default=0, nullable=False)
    yeare=db.Column(db.Integer, default=0, nullable=False)
    yeara_efficiency=db.Column(db.Integer, default=0, nullable=False)
    yearb_efficiency=db.Column(db.Integer, default=0, nullable=False)
    yearc_efficiency=db.Column(db.Integer, default=0, nullable=False)
    yeard_efficiency=db.Column(db.Integer, default=0, nullable=False)
    yeare_efficiency=db.Column(db.Integer, default=0, nullable=False)
    status=db.Column(db.Integer, default=1, nullable=False)
    source_data=db.Column(db.String(10), default='M', nullable=False)
    added_by=db.Column(db.String(100), nullable=False)

with app.app_context():
    db.create_all()


class Calculation(db.Model):
    __tablename__ = 'calculation'
    cal_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    phase_id=db.Column(db.Integer, nullable=False)
    stlc_name=db.Column(db.String(100), nullable=False)
    pod=db.Column(db.String(100), nullable=True)
    poa=db.Column(db.String(100), nullable=True)
    overr=db.Column(db.Integer, default=0, nullable=False)
    podph=db.Column(db.String(100), nullable=True)
    poaph=db.Column(db.String(100), nullable=True)
    oes=db.Column(db.String(100), nullable=True)
    sais=db.Column(db.String(100), nullable=True)
    status=db.Column(db.Integer, default=1, nullable=False)
    category_name=db.Column(db.Integer, nullable=False)
    ini_duration=db.Column(db.Integer, nullable=False)
    ini_day=db.Column(db.Integer, nullable=False)
    yeara=db.Column(db.Integer, default=0, nullable=False)
    yearb=db.Column(db.Integer, default=0, nullable=False)
    yearc=db.Column(db.Integer, default=0, nullable=False)
    yeard=db.Column(db.Integer, default=0, nullable=False)
    yeare=db.Column(db.Integer, default=0, nullable=False)
    added_by=db.Column(db.String(100), nullable=False)

with app.app_context():
    db.create_all()

class Calculationyear(db.Model):
    __tablename__ = 'calculationyear'
    cal_yr_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    cal_id=db.Column(db.Integer, nullable=False)
    stlc_name=db.Column(db.String(100), nullable=True)
    catelog_name=db.Column(db.String(100), nullable=True)
    yeara=db.Column(db.Integer, default=0, nullable=False)
    yearb=db.Column(db.Integer, default=0, nullable=False)
    yearc=db.Column(db.Integer, default=0, nullable=False)
    yeard=db.Column(db.Integer, default=0, nullable=False)
    yeare=db.Column(db.Integer, default=0, nullable=False)
    added_by=db.Column(db.String(100), nullable=False)

with app.app_context():
    db.create_all()

class Phase(db.Model):
    __tablename__ = 'phase'
    phase_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    phase_name=db.Column(db.String(100), nullable=False)
    status=db.Column(db.Integer, default=1, nullable=False)

with app.app_context():
    db.create_all()

class Validateimplement(db.Model):
    __tablename__ = 'validateimplement'
    imp_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    phase_id=db.Column(db.Integer, default=0, nullable=False)
    phase_value=db.Column(db.Integer, default=0, nullable=False)
    status=db.Column(db.Integer, default=1, nullable=False)

with app.app_context():
    db.create_all()


class Usersolution(db.Model):
    __tablename__ = 'user_solution'
    user_sol_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    sol_id=db.Column(db.Integer, nullable=False)
    user_id=db.Column(db.Integer, nullable=False)
    user_email=db.Column(db.String(100), nullable=False)
    catelog=db.Column(db.String(100), nullable=False)
    stlc_name=db.Column(db.String(100), nullable=False)
    status=db.Column(db.Integer, default=1, nullable=False)

with app.app_context():
    db.create_all()