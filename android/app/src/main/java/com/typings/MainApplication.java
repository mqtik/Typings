package com.typings;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecomponent.splashscreen.RCTSplashScreenPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.futurepress.staticserver.FPStaticServerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.modules.storage.ReactDatabaseSupplier;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      long size = 100L * 1024L * 1024L; // 100 MB 
      com.facebook.react.modules.storage.ReactDatabaseSupplier.getInstance(getApplicationContext()).setMaximumSize(size);
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFetchBlobPackage(),
            new RNCWebViewPackage(),
            new ReactNativeDialogsPackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            new RCTSplashScreenPackage(),
            new OrientationPackage(),
            new RNZipArchivePackage(),
            new FPStaticServerPackage(),
            new LinearGradientPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
