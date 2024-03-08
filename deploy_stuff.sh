#!/bin/sh

# For compiling, apparently
export ANDROID_HOME="$HOME/Android/Sdk"
[[ "$PATH" != */usr/lib/jvm/java-17-openjdk/bin* ]] && export PATH="/usr/lib/jvm/java-17-openjdk/bin:$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"

[ ! -z "$ANDROID_SDK_HOME" ] && {
    echo "It appears you have the \$ANDROID_SDK_HOME variable set."
    echo "This variable is deprecated and will cause gradlew to abort the build."
    echo "Check your $HOME/.bashrc file to see if you're setting it there, or try running this script again in a new terminal."
    echo "To unset it just for this build, edit the deploy_stuff.sh file and uncomment the line after this one."
    # unset ANDROID_SDK_HOME ||
    {
        echo "Exiting..."
        exit 2
    }
}

# For publishing to google play store, I guess?
[ ! -f android/app/facial-analytics-test.keystore ] && keytool -genkeypair -v -storetype PKCS12 -keystore secrets/facial-analytics-test.keystore -alias test -keyalg RSA -keysize 2048 -validity 10000

npx expo prebuild -p android
cd android
sh ./gradlew assembleRelease
SUCCESS=$?
cd ..

[ "$SUCCESS" = "0" ] && {
    echo ""
    echo "Built android apk. Location should be android/app/build/outputs/apk/release/app-release.apk"
    echo "BTW, I was able to install this without the app store by loading it on my phone, then \"opening\" it, then enabling the install unknown apps permission. -M 2024-03-01"
}
