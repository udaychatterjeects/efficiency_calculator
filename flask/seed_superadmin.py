"""Run once to create the superadmin account and seed master data.
Usage: python seed_superadmin.py  (from the flask directory)
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app import app, db
from controllers.Superadmin import _seed_master_efforts, _seed_master_solutions, SUPERADMIN_EMAIL
from extras.utilities import encrypt_password
from models.User import User
import datetime

with app.app_context():
    if User.query.filter_by(email=SUPERADMIN_EMAIL).first():
        print(f"Superadmin '{SUPERADMIN_EMAIL}' already exists.")
    else:
        password = encrypt_password('super@cog.com123')
        superadmin = User(
            email=SUPERADMIN_EMAIL,
            password=password,
            firstname='Super',
            lastname='Admin',
            user_role='superadmin',
            email_confirmed=1,
            created_at=datetime.datetime.now(),
        )
        db.session.add(superadmin)
        db.session.commit()
        print(f"Superadmin '{SUPERADMIN_EMAIL}' created.")

    _seed_master_efforts()
    _seed_master_solutions()
    print("Master STLC activities and AI solutions seeded.")
    print("Done. Restart Flask to activate the new superadmin routes.")
