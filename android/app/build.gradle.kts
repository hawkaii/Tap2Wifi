plugins {
    id("com.android.application")
    id("kotlin-android")
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.civic_auth_flutter"
    compileSdk = flutter.compileSdkVersion
    // ndkVersion = "27.0.12077973" // Optional: Remove if not using native libs (recommended to remove if not needed)

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    defaultConfig {
        applicationId = "com.example.civic_auth_flutter"
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName

        // ✅ Correct way to assign manifest placeholders for flutter_appauth
        manifestPlaceholders["appAuthRedirectScheme"] = "trustlink"
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

flutter {
    source = "../.."
}

dependencies {
    // These are often needed but not strictly for flutter_appauth's core redirect.
    // Keep them if you use other Google services or a general dependency.
    implementation("com.google.android.gms:play-services-auth:20.7.0")
    implementation("com.google.android.gms:play-services-base:18.2.0")
    // ✅ This is REQUIRED for Chrome Custom Tabs, which flutter_appauth uses.
    implementation("androidx.browser:browser:1.6.0")
}