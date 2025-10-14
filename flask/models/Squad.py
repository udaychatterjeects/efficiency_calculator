# from app import db, app
# from sqlalchemy.orm import backref

# class Squad(db.Model):
#     __tablename__ = 'squads'
#     squad_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
#     squad_name=db.Column(db.String(100), nullable=True)


# class UserSquad(db.Model):
#     __tablename__ = 'user_squad'
#     user_squad_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
#     user_id=db.Column(db.Integer, db.ForeignKey('users.user_id'))
#     squad_id=db.Column(db.Integer, db.ForeignKey('squads.squad_id'))
#     squaddata = db.relationship("Squad", backref=backref("squads", lazy="dynamic"))
#     userdata = db.relationship("User", backref=backref("users", lazy="dynamic"))

# with app.app_context():
#     db.create_all()