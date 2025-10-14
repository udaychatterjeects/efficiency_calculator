# Create Virtual Environment
py -3 -m venv syncup_call
source syncup_call/Scripts/activate

# Dependency Details
pip install flask
pip install validate_email

# Run Application
flask run

# Create requirements.txt file
pip3 freeze > requirements.txt

# Run requirements.txt file
pip install -r requirements.txt

# Run server script
flask run -h 0.0.0.0 -p 280
