from app import db, app
from sqlalchemy.orm import backref

# class Squad(db.Model):
#     __tablename__ = 'squads'
#     squad_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
#     squad_name=db.Column(db.String(100), nullable=True)


class Solution(db.Model):
    __tablename__ = 'solutions'    
    solution_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    solution_name=db.Column(db.String(100), nullable=False)
    stlc_id=db.Column(db.Integer, nullable=False)
    solution_name=db.Column(db.String(100), nullable=False)
    solution_categoty=db.Column(db.String(100), nullable=False)
    solution_type=db.Column(db.String(100), nullable=False)
    license_type=db.Column(db.String(100), nullable=False)
    license_cost=db.Column(db.String(100), nullable=False)
    frequency=db.Column(db.String(100), nullable=False)
    effort_saving=db.Column(db.Integer, nullable=False)
    preffred_tool=db.Column(db.String(100), default='Y', nullable=False)
    short_desc=db.Column(db.Text, nullable=False)
    adoption_percent=db.Column(db.Integer, nullable=False)
    added_by=db.Column(db.String(100), nullable=False)
    status=db.Column(db.Integer, default=1, nullable=False)

with app.app_context():
     db.create_all()