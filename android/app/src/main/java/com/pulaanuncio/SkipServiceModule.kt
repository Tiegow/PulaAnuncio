package com.pulaanuncio

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.provider.Settings
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class SkipServiceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val skipReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == "com.pulaanuncio.AD_SKIPPED") {
                val count = intent.getIntExtra("skip_count", 0)
                val params = Arguments.createMap()
                params.putInt("skipCount", count)
                reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onAdSkipped", params)
            }
        }
    }

    override fun initialize() {
        super.initialize()
        val filter = IntentFilter("com.pulaanuncio.AD_SKIPPED")
        // Use RECEIVER_NOT_EXPORTED for security on Android 13+ or local broadcasts
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            reactApplicationContext.registerReceiver(skipReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            reactApplicationContext.registerReceiver(skipReceiver, filter)
        }
    }

    override fun invalidate() {
        super.invalidate()
        try {
            reactApplicationContext.unregisterReceiver(skipReceiver)
        } catch (e: Exception) {
            // Ignorar se não estava registrado
        }
    }

    override fun getName(): String {
        return "SkipServiceModule"
    }

    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun isServiceEnabled(promise: Promise) {
        val enabledServices = Settings.Secure.getString(reactApplicationContext.contentResolver, Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES)
        val isEnabled = enabledServices?.contains(reactApplicationContext.packageName + "/" + YouTubeSkipService::class.java.name) == true
        promise.resolve(isEnabled)
    }

    @ReactMethod
    fun setSkipEnabled(enabled: Boolean) {
        val prefs = reactApplicationContext.getSharedPreferences("PulaAnuncioPrefs", Context.MODE_PRIVATE)
        prefs.edit().putBoolean("skip_enabled", enabled).apply()
    }

    @ReactMethod
    fun getSkipEnabled(promise: Promise) {
        val prefs = reactApplicationContext.getSharedPreferences("PulaAnuncioPrefs", Context.MODE_PRIVATE)
        val enabled = prefs.getBoolean("skip_enabled", true)
        promise.resolve(enabled)
    }
    
    @ReactMethod
    fun setMuteEnabled(enabled: Boolean) {
        val prefs = reactApplicationContext.getSharedPreferences("PulaAnuncioPrefs", Context.MODE_PRIVATE)
        prefs.edit().putBoolean("mute_enabled", enabled).apply()
    }

    @ReactMethod
    fun getMuteEnabled(promise: Promise) {
        val prefs = reactApplicationContext.getSharedPreferences("PulaAnuncioPrefs", Context.MODE_PRIVATE)
        val enabled = prefs.getBoolean("mute_enabled", false)
        promise.resolve(enabled)
    }

    @ReactMethod
    fun getSkipCount(promise: Promise) {
        val prefs = reactApplicationContext.getSharedPreferences("PulaAnuncioPrefs", Context.MODE_PRIVATE)
        val count = prefs.getInt("skip_count", 0)
        promise.resolve(count)
    }

    @ReactMethod
    fun resetSkipCount() {
        val prefs = reactApplicationContext.getSharedPreferences("PulaAnuncioPrefs", Context.MODE_PRIVATE)
        prefs.edit().putInt("skip_count", 0).apply()
    }

    // Required for RN built-in Event Emitter Calls
    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}
}
