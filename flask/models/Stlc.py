from app import db, app
from sqlalchemy.orm import backref

# class Squad(db.Model):
#     __tablename__ = 'squads'
#     squad_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
#     squad_name=db.Column(db.String(100), nullable=True)


class Stlc(db.Model):
    __tablename__ = 'stlc_new'    
    stlc_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    stlc_name=db.Column(db.String(100), nullable=False)
    status=db.Column(db.Integer, default=1, nullable=False)
    default=db.Column(db.Integer, default=0, nullable=False)

with app.app_context():
     db.create_all()