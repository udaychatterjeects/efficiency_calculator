from app import db, app
from sqlalchemy.orm import backref

# class Squad(db.Model):
#     __tablename__ = 'squads'
#     squad_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
#     squad_name=db.Column(db.String(100), nullable=True)


# class Comparison(db.Model):
#     __tablename__ = 'comparison'
#     comparison_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
#     # user_id=db.Column(db.Integer, db.ForeignKey('users.user_id'))
#     squad_id=db.Column(db.Integer, db.ForeignKey('squads.squad_id'))
#     application_id=db.Column(db.Integer, db.ForeignKey('applications.application_id'))
#     image_count=db.Column(db.Integer, default=0)
#     # file_name=db.Column(db.String(255), nullable=True, default="Null")
#     # baseline_dimension=db.Column(db.String(255), nullable=True, default="Null")
#     # actual_dimension=db.Column(db.String(255), nullable=True, default="Null")
#     # comparison_result=db.Column(db.String(255), nullable=True, default="Null")
#     # difference_sections=db.Column(db.String(255), nullable=True, default="Null")
#     # ss_index=db.Column(db.String(255), nullable=True, default="Null")
#     created_at=db.Column(db.String(255), nullable=False)

#     squaddata = db.relationship("Squad")
#     # userdata = db.relationship("User", backref=backref("users", lazy="dynamic"))
# #     appdata = db.relationship("Application")

# class ComparisonDetails(db.Model):
#     __tablename__ = 'comparison_details'
#     comparison_details_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
#     # user_id=db.Column(db.Integer, db.ForeignKey('users.user_id'))
#     # comparison_id=db.Column(db.Integer, db.ForeignKey('comparison.comparison_id'))
#     squad_id=db.Column(db.Integer, db.ForeignKey('squads.squad_id'))
#     application_id=db.Column(db.Integer, db.ForeignKey('applications.application_id'))
#     # image_count=db.Column(db.Integer, default=0)
#     file_name=db.Column(db.String(255), nullable=True, default="Null")
#     baseline_dimension=db.Column(db.String(255), nullable=True, default="Null")
#     actual_dimension=db.Column(db.String(255), nullable=True, default="Null")
#     comparison_result=db.Column(db.String(255), nullable=True, default="Null")
#     difference_sections=db.Column(db.String(255), nullable=True, default="Null")
#     ss_index=db.Column(db.String(255), nullable=True, default="Null")
#     created_at=db.Column(db.String(255), nullable=False)

#     squaddata = db.relationship("Squad")
#     # userdata = db.relationship("User", backref=backref("users", lazy="dynamic"))
#     appdata = db.relationship("Application")



# with app.app_context():
#     db.create_all()