@echo off
echo ========================================
echo    Brelinx Connect - Quick Build APK
echo ========================================
echo.

echo [1/4] Copying web assets to dist folder...
xcopy /E /Y index.html dist\ >nul 2>&1
xcopy /E /Y /I src dist\src >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to copy web assets
    pause
    exit /b 1
)
echo ✓ Web assets copied

echo.
echo [2/4] Syncing with Capacitor...
call npx cap sync
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed
    pause
    exit /b 1
)
echo ✓ Capacitor sync completed

echo.
echo [3/4] Cleaning previous build...
cd android
call .\gradlew.bat clean >nul 2>&1
echo ✓ Clean completed

echo.
echo [4/4] Building APK...
call .\gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ERROR: APK build failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo ✓ BUILD SUCCESSFUL!
echo ========================================
echo.
echo APK Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Opening APK folder...
explorer android\app\build\outputs\apk\debug

echo.
echo Build completed successfully!
echo You can now install the APK on your Android device.
pause