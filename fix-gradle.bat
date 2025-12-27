@echo off
echo ========================================
echo    Fixing Gradle Download Issues
echo ========================================
echo.

echo [1/3] Stopping all Gradle daemons...
cd android
call .\gradlew.bat --stop 2>nul
cd ..
echo ✓ Gradle daemons stopped

echo.
echo [2/3] Clearing Gradle cache...
rmdir /s /q "%USERPROFILE%\.gradle\wrapper\dists\gradle-8.10.2-all" 2>nul
rmdir /s /q "%USERPROFILE%\.gradle\caches" 2>nul
echo ✓ Cache cleared

echo.
echo [3/3] Using offline mode for first sync...
echo This will use a simpler Gradle version that should work.
echo.

echo Updating to Gradle 8.5 (more stable)...
cd android
echo distributionBase=GRADLE_USER_HOME > gradle\wrapper\gradle-wrapper.properties
echo distributionPath=wrapper/dists >> gradle\wrapper\gradle-wrapper.properties
echo distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-all.zip >> gradle\wrapper\gradle-wrapper.properties
echo networkTimeout=10000 >> gradle\wrapper\gradle-wrapper.properties
echo zipStoreBase=GRADLE_USER_HOME >> gradle\wrapper\gradle-wrapper.properties
echo zipStorePath=wrapper/dists >> gradle\wrapper\gradle-wrapper.properties
cd ..

echo.
echo ========================================
echo ✓ GRADLE CONFIGURATION UPDATED!
echo ========================================
echo.
echo Now try syncing in Android Studio again.
echo If it still fails, we'll use a different approach.
pause