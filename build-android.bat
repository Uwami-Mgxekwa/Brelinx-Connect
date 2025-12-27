@echo off
echo Building Brelinx Connect Android APK...
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Syncing web assets...
call npx cap sync
if %errorlevel% neq 0 (
    echo Error: Failed to sync assets
    pause
    exit /b 1
)

echo.
echo Step 3: Opening Android Studio...
echo Please build the APK in Android Studio:
echo 1. Build → Generate Signed Bundle/APK
echo 2. Choose APK
echo 3. Select debug or release
echo 4. Build APK
echo.
call npx cap open android

echo.
echo Build script completed!
echo Check Android Studio for APK generation.
pause