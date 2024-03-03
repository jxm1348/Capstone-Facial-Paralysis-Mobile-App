#!/bin/sh

# For compiling, apparently
export ANDROID_HOME="$HOME/Android/Sdk"
[[ "$PATH" != */usr/lib/jvm/java-17-openjdk/bin* ]] && export PATH="/usr/lib/jvm/java-17-openjdk/bin:$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"

# For publishing to google play store, I guess?
[ ! -f android/app/facial-analytics-test.keystore ] && keytool -genkeypair -v -storetype PKCS12 -keystore secrets/facial-analytics-test.keystore -alias test -keyalg RSA -keysize 2048 -validity 10000

npx expo prebuild -p android
cd android
sh ./gradlew assembleRelease
cd ..

echo "Built android apk. Location should be android/app/build/outputs/apk/release/app-release.apk"
echo "I was able to install this without the app store by loading it on my phone, then \"opening\" it, then enabling the install unknown apps permission. -M 2024-03-01"
