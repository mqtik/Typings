# Get started
Clone repository
--URL Repository git


# Install
npm install

react-native link react-native-gesture-handler


npm install --save rn-splash-screen

react-native link rn-splash-screen

react-native link react-native-linear-gradient

# Clean Install
npm start -- --reset-cache

# Run
react-native run-ios

react-native run-android


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
 2. `npm install -g yo generator-rn-toolbox`
 3. Install imagemagick
`brew install imagemagick`
 4. Apply splash screen on iOS

 ```yo rn-toolbox:assets --splash YOURIMAGE.png --ios```

 or Android

 ```yo rn-toolbox:assets --splash YOURIMAGE.png --android```


That's all. :) 

[Source][1]


  [1]: https://github.com/bamlab/generator-rn-toolbox/blob/master/generators/assets/README.md