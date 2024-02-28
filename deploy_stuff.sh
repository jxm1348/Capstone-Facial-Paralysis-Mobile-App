#!/bin/sh

# For compiling, apparently
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="/usr/lib/jvm/java-17-openjdk/bin:$PATH"
export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="$PATH:$ANDROID_HOME/platform-tools"

# For publishing to google play store
[ ! -f secrets/facial-analytics-test.keystore ] && keytool -genkeypair -v -storetype PKCS12 -keystore secrets/facial-analytics-test.keystore -alias test -keyalg RSA -keysize 2048 -validity 10000

