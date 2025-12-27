@echo off
echo ========================================
echo    Brelinx Connect - Studio Build
echo ========================================
echo.

echo [1/2] Copying web assets and syncing...
xcopy /E /Y index.html dist\ >nul 2>&1
xcopy /E /Y /I src dist\src >nul 2>&1
call npx cap sync
echo ✓ Sync completed

echo.
echo [2/2] Opening Android Studio...
echo.
echo INSTRUCTIONS:
echo 1. Wait for Gradle sync to complete
echo 2. Build → Build Bundle(s) / APK(s) → Build APK(s)
echo 3. Click "locate" when build completes
echo.
call npx cap open android

echo.
echo Android Studio opened!
echo Follow the instructions above to build your APK.
pause