@echo off

REM Set application environment variables
set APP=app.py
set WORKERS=5
set HOST=0.0.0.0
set PORT=285

REM Activate virtual environment
call .\syncup_call\Scripts\activate

REM flask run -h %HOST% -p %PORT%
flask run

pause
