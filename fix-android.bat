@echo off
echo ========================================
echo    Fixing Android Project Issues
echo ========================================
echo.

echo IMPORTANT: Make sure Android Studio is CLOSED before continuing!
echo Press any key when Android Studio is closed...
pause

echo.
echo [1/3] Removing corrupted Android project...
rmdir /s /q android 2>nul
echo ✓ Android project removed

echo.
echo [2/3] Regenerating Android project...
call npx cap add android
if %errorlevel% neq 0 (
    echo ERROR: Failed to add Android platform
    pause
    exit /b 1
)
echo ✓ Android project regenerated

echo.
echo [3/3] Testing build...
cd android
call .\gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ERROR: Build test failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo ✓ ANDROID PROJECT FIXED!
echo ========================================
echo.
echo You can now use quick-build.bat or open Android Studio
pause