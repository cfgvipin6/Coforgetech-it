package com.iniitian_mobile;

import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SecureModule extends ReactContextBaseJavaModule {
    private static Boolean isOn = false;
    public SecureModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void navigateToSecurePage() {
       Intent i = new Intent(getReactApplicationContext(),SecureActivity.class);
       getCurrentActivity().startActivity(i);
    }
    @Override
    public String getName() {
        return "SecureModule";
    }

}
