from app import db, app
from sqlalchemy.orm import backref


# class Application(db.Model):
#     __tablename__ = 'applications'
#     application_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
#     application_name=db.Column(db.String(100), nullable=True)


# class ApplicationSquad(db.Model):
#     __tablename__ = 'application_squad'
#     app_squad_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
#     application_id=db.Column(db.Integer, db.ForeignKey('applications.application_id'))
#     squad_id=db.Column(db.Integer, db.ForeignKey('squads.squad_id'))
#     sqdata = db.relationship("Squad")
#     appdata = db.relationship("Application")

# with app.app_context():
#     db.create_all()