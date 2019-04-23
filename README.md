# Install
npm install

# Link to native code
1. react-native link react-native-gesture-handler
2. react-native link rn-splash-screen
3. react-native link react-native-linear-gradient
4. react-native link react-native-static-server && react-native link react-native-webview && react-native link react-native-zip-archive && RNFB_ANDROID_PERMISSIONS=true react-native link rn-fetch-blob && react-native link react-native-orientation
5. react-native link react-native-dialogs
6. react-native link react-native-vector-icons
7. RNFB_ANDROID_PERMISSIONS=true react-native link react-native-fetch-blob

# Clean Install
lsof -ti :8081 | xargs kill -9
npm start -- --reset-cache


# Run
react-native run-ios

react-native run-android

# Release on Android

./gradlew assembleRelease

On node_modules/react-native/react.grandle
Place this code where doFirst{} method is
		`
		doLast {
            def moveFunc = { resSuffix ->
                File originalDir = file("$buildDir/generated/res/react/release/drawable-${resSuffix}");
                if (originalDir.exists()) {
                    File destDir = file("$buildDir/../src/main/res/drawable-${resSuffix}");
                    ant.move(file: originalDir, tofile: destDir);
                }
            }
            moveFunc.curry("ldpi").call()
            moveFunc.curry("mdpi").call()
            moveFunc.curry("hdpi").call()
            moveFunc.curry("xhdpi").call()
            moveFunc.curry("xxhdpi").call()
            moveFunc.curry("xxxhdpi").call()
        }
        `



## Errors

	- No bundle URL present.
		Run: 
			rm -rf ios/build/; lsof -ti :8081 | xargs kill -9; react-native run-ios

	- React Native Settings
		Go to react-native-settings under node_modules folder, and change its .JSX extensions to .JS




# Splashscreen & icon
I recommend [generator-rn-toolbox](https://github.com/bamlab/generator-rn-toolbox) for applying launch screen or main icon using on react-native. It is more simple and easy to use through cli as react-native.

 - Do not need to open XCode.
 - Do not need to make a lot of image files for various resolutions.
 - Anytime change launch screen using one line commend. 


## Requirements

 - node >= 6
 - One **square** image or psd file with a size of more than **2208x2208** px resolution for a launch screen(splash screen)
 - Positive mind ;)

## Install
 1. Install generator-rn-toolbox and yo
 2. `npm install -g yo `
 3. Install imagemagick
`brew install imagemagick`
 4. Apply splash screen on iOS

 ```yo rn-toolbox:assets --splash YOURIMAGE.png --ios```

 or Android

 ```yo rn-toolbox:assets --splash YOURIMAGE.png --android```


That's all. :) 


## Run on iOS
- react-native run-ios --configuration Release --device "Matías’s iPhone"

Go to XCode -> Products -> Scheme -> Edit Scheme 
On Build Configuration, change Debug to Release


## Android

1. DEX Error on Compile 
	Go to *android/build.gradle*
	
	On *defaultConfig* {} (where is the targetSdk, compileSdk, etc.),
	 place this line:
	 `multiDexEnabled = true`


[Source][1]


  [1]: https://github.com/bamlab/generator-rn-toolbox/blob/master/generators/assets/README.md
