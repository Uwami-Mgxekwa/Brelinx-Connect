@echo off
echo ========================================
echo    Brelinx Connect - Sync Changes
echo ========================================
echo.

echo [1/2] Copying web assets to dist folder...
xcopy /E /Y index.html dist\ >nul 2>&1
xcopy /E /Y /I src dist\src >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to copy web assets
    pause
    exit /b 1
)
echo ✓ Web assets copied

echo.
echo [2/2] Syncing with Capacitor...
call npx cap sync
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ SYNC COMPLETED!
echo ========================================
echo.
echo Changes synced to Android project.
echo Now build in Android Studio or run quick-build.bat
echo.
pause