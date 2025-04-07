# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# Bảo vệ các class và phương thức trong ứng dụng của bạn khỏi bị obfuscate hoặc loại bỏ
-keep class com.aucitizenshiptest2024.** { *; }

# Bảo vệ các class liên quan đến AsyncStorage hoặc EncryptedStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-keep class com.facebook.react.modules.storage.** { *; }

# Bảo vệ các class liên quan đến Redux-Persist
-keep class com.github.reactnativecommunity.asyncstorage.** { *; }
-keep class com.reactnativereduxpersist.** { *; }

# Đảm bảo không loại bỏ hoặc làm rối tên các class có thể sử dụng trong native modules
-keep class com.facebook.react.** { *; }

# Không ghi cảnh báo liên quan đến các thư viện không cần thiết (tùy chọn)
-dontwarn okhttp3.**
-dontwarn retrofit2.Platform
-keep class io.realm.react.**