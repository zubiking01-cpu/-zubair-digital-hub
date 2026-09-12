@echo off
title Zubair Digital Hub - Live Production Server
color 0A
echo ========================================================
echo         ZUBAIR DIGITAL HUB - LIVE LOCAL SERVER          
echo ========================================================
echo.
echo Starting local live server on port 8080...
echo.
echo Website URL:      http://localhost:8080/index.html
echo Checkout URL:     http://localhost:8080/checkout.html
echo Admin Panel URL:  http://localhost:8080/admin.html
echo.
start http://localhost:8080/index.html
python -m http.server 8080
pause
