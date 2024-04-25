@echo off

rem Start nodemon to run the server
start /B nodemon login.js

rem Open the browser after a brief delay (adjust the delay as needed)
timeout /t 0 /nobreak >nul
start http://localhost:3000/indexx  # Adjust the port as needed
