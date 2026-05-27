@echo off

REM Set application environment variables
set APP=app.py
set WORKERS=5
set HOST=0.0.0.0
set PORT=280

REM Activate virtual environment
call .\.venv\Scripts\activate

flask run -h %HOST% -p %PORT%

pause
