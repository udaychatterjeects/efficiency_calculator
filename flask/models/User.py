from app import db, app

class User(db.Model):
    __tablename__ = 'users'
    user_id=db.Column(db.Integer, autoincrement=True, primary_key=True)
    email=db.Column(db.String(100), unique=True, nullable=False)
    password=db.Column(db.String(100), nullable=False)
    firstname=db.Column(db.String(100), nullable=True)
    lastname=db.Column(db.String(100), nullable=True)
    user_role=db.Column(db.String(100), nullable=False)
    email_confirmed=db.Column(db.Integer, default=0, nullable=False)
    created_at=db.Column(db.String(100), nullable=False)


class Usertoken(db.Model):
    __tablename__ = 'user_tokens'
    id=db.Column(db.Integer, autoincrement=True, nullable=False, primary_key=True)
    user_id=db.Column(db.Integer, nullable=False)
    user_email=db.Column(db.String(100), nullable=False)
    reset_token=db.Column(db.String(100), nullable=False)
    requested_on=db.Column(db.String(100), nullable=True)

with app.app_context():
    db.create_all()