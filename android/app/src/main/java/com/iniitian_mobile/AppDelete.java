package com.iniitian_mobile;

import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AppDelete extends ReactContextBaseJavaModule {
    private static Boolean isOn = false;
    public AppDelete(ReactApplicationContext reactContext) {
        super(reactContext);
    }

//    @ReactMethod
////    public void getStatus(
////            Callback successCallback) {
////        successCallback.invoke(null, isOn);
////
////    }

    @ReactMethod
    public void uninstall_App(String appUri) {
        Intent intent = new Intent(Intent.ACTION_DELETE);
        intent.setData(Uri.parse("package:"+appUri));
        getCurrentActivity().startActivity(intent);
    }
    @Override
    public String getName() {
        return "AppDelete";
    }

}
