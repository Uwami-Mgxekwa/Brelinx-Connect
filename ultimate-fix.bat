@echo off
echo ========================================
echo    ULTIMATE ANDROID BUILD FIX
echo ========================================
echo.

echo STEP 1: Close Android Studio completely!
echo Press any key when Android Studio is closed...
pause

echo.
echo [1/5] Stopping all Gradle processes...
taskkill /f /im java.exe 2>nul
taskkill /f /im gradle.exe 2>nul
echo ✓ Processes stopped

echo.
echo [2/5] Clearing ALL Gradle caches...
rmdir /s /q "%USERPROFILE%\.gradle" 2>nul
rmdir /s /q "android\.gradle" 2>nul
rmdir /s /q "android\app\build" 2>nul
echo ✓ Caches cleared

echo.
echo [3/5] Regenerating Android project...
rmdir /s /q android 2>nul
call npx cap add android
echo ✓ Android project regenerated

echo.
echo [4/5] Configuring for Java compatibility...
echo org.gradle.java.home=C:\\Program Files\\Android\\Android Studio\\jbr >> android\gradle.properties
echo ✓ JDK configured

echo.
echo [5/5] Opening Android Studio with correct settings...
echo.
echo IMPORTANT INSTRUCTIONS:
echo 1. Wait for Android Studio to open
echo 2. Go to File → Settings → Build Tools → Gradle
echo 3. Set Gradle JDK to "Android Studio default JDK"
echo 4. Click Apply and OK
echo 5. Let it sync
echo 6. Build → Build Bundle(s) / APK(s) → Build APK(s)
echo.
call npx cap open android

echo.
echo ========================================
echo ✓ SETUP COMPLETE!
echo ========================================
echo.
echo Follow the instructions above in Android Studio.
pause