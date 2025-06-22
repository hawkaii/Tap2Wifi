// import 'dart:convert';

// import 'package:flutter/services.dart';
// import 'package:flutter_appauth/flutter_appauth.dart';
// import 'package:get/get.dart';
// import 'package:http/http.dart' as http;

// import '../app_routes.dart';
// import '../config/civic_config.dart';
// import 'secure_storage_service.dart';

// class AuthService extends GetxService {
//   final FlutterAppAuth _appAuth = FlutterAppAuth();
//   final SecureStorageService _secureStorage = SecureStorageService();

//   final RxBool isLoading = false.obs;
//   final RxString errorMessage = ''.obs;

//   @override
//   void onInit() {
//     super.onInit();
//   }

//   Future<bool> signIn() async {
//     isLoading.value = true;
//     errorMessage.value = '';

//     AuthorizationTokenResponse? result;
//     try {
//       print('[CIVIC DEBUG] Attempting authorizeAndExchangeCode...');
//       result = await _appAuth.authorizeAndExchangeCode(
//         AuthorizationTokenRequest(
//           CIVIC_CLIENT_ID,
//           CIVIC_REDIRECT_URI,
//           serviceConfiguration: AuthorizationServiceConfiguration(
//             authorizationEndpoint: '$CIVIC_ISSUER/oauth/auth',
//             tokenEndpoint: '$CIVIC_ISSUER/oauth/token',
//           ),
//           scopes: CIVIC_SCOPES,
//         ),
//       );
//       print('[CIVIC DEBUG] authorizeAndExchangeCode completed.');

//       // --- CORRECTED DEBUG LOGGING STARTS HERE ---
//       if (result == null) {
//         print(
//           '[CIVIC DEBUG] AuthorizationTokenResponse is NULL after authorizeAndExchangeCode.',
//         );
//         errorMessage.value =
//             'Login failed: Authentication process did not return a response. User cancelled or an internal issue occurred.';
//         return false;
//       }

//       print(
//         '[CIVIC DEBUG] AuthorizationTokenResponse received. Checking properties...',
//       );
//       print(
//         '  Access Token: ${result.accessToken != null ? "RECEIVED" : "NULL"}',
//       );
//       print(
//         '  Refresh Token: ${result.refreshToken != null ? "RECEIVED" : "NULL"}',
//       );
//       print('  ID Token: ${result.idToken != null ? "RECEIVED" : "NULL"}');
//       print('  Token Type: ${result.tokenType ?? 'NULL'}');
//       // Corrected: expiresIn is usually in tokenAdditionalParameters, but accessTokenExpirationDateTime is a direct property
//       print(
//         '  Access Token Expiration DateTime: ${result.accessTokenExpirationDateTime ?? 'NULL'}',
//       );

//       print(
//         '  Authorization Additional Parameters: ${result.authorizationAdditionalParameters ?? 'NULL'}',
//       );
//       print(
//         '  Token Additional Parameters: ${result.tokenAdditionalParameters ?? 'NULL'}',
//       );
//       // You can try to specifically get 'expires_in' from tokenAdditionalParameters if you need the raw integer:
//       print(
//         '  Expires In (from tokenAdditionalParameters): ${result.tokenAdditionalParameters?['expires_in'] ?? 'NULL'}',
//       );
//       // --- CORRECTED DEBUG LOGGING ENDS HERE ---

//       if (result.accessToken != null) {
//         await _secureStorage.saveToken(result.accessToken!);
//         return true;
//       } else {
//         errorMessage.value =
//             'Login failed: No access token received from Civic.';
//         return false;
//       }
//     } on PlatformException catch (e) {
//       print('[CIVIC ERROR] Sign-in failed (PlatformException): $e');
//       if (e.code == 'null_intent') {
//         errorMessage.value =
//             'Login failed: App did not receive a proper redirect. Check your AndroidManifest.xml and Civic Redirect URI configuration.';
//       } else if (e.code == 'authorize_and_exchange_code_failed' &&
//           e.message?.contains('User cancelled flow') == true) {
//         errorMessage.value = 'Login cancelled by user.';
//       } else {
//         errorMessage.value =
//             'Login failed: ${e.message ?? 'An unknown platform error occurred.'}';
//       }
//       return false;
//     } catch (e) {
//       print('[CIVIC ERROR] Sign-in failed (Generic Error): $e');
//       errorMessage.value =
//           'Login failed: An unexpected error occurred. Please try again.';
//       return false;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   /// 👤 Fetch user info using access token
//   Future<Map<String, dynamic>?> getUserInfo() async {
//     final token = await _secureStorage.getToken();
//     if (token == null) {
//       print('[CIVIC ERROR] Token is null');
//       return null;
//     }

//     try {
//       final response = await http.get(
//         Uri.parse('$CIVIC_ISSUER/oauth/userinfo'),
//         headers: {'Authorization': 'Bearer $token'},
//       );

//       if (response.statusCode == 200) {
//         return jsonDecode(response.body);
//       } else {
//         print(
//           '[CIVIC ERROR] Failed to fetch user info: ${response.statusCode}, ${response.body}',
//         );
//         return null;
//       }
//     } catch (e) {
//       print('[CIVIC ERROR] Error fetching user info: $e');
//       return null;
//     }
//   }

//   /// 🔓 Logout user (clear stored token)
//   Future<void> logout() async {
//     await _secureStorage.clear();
//     print('[CIVIC] User logged out.');
//     Get.offAllNamed(AppRoutes.login);
//   }
// }

import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;

import '../app_routes.dart'; // Replace with your actual route file
import '../config/civic_config.dart'; // Replace with your actual Civic constants file

class AuthService extends GetxService {
  final FlutterAppAuth _appAuth = FlutterAppAuth();
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  final RxBool isLoading = false.obs;
  final RxString errorMessage = ''.obs;

  /// Sign in using Civic OAuth
  Future<bool> signIn() async {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      final result = await _appAuth.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          CIVIC_CLIENT_ID,
          CIVIC_REDIRECT_URI,
          serviceConfiguration: AuthorizationServiceConfiguration(
            authorizationEndpoint: '$CIVIC_ISSUER/oauth/auth',
            tokenEndpoint: '$CIVIC_ISSUER/oauth/token',
          ),
          scopes: CIVIC_SCOPES,
        ),
      );

      if (result == null || result.accessToken == null) {
        errorMessage.value = 'Login failed: No access token received.';
        return false;
      }

      await _secureStorage.write(
        key: 'access_token',
        value: result.accessToken!,
      );
      return true;
    } on PlatformException catch (e) {
      print('[CIVIC ERROR] PlatformException: $e');
      errorMessage.value = e.message ?? 'Platform error occurred.';
      return false;
    } catch (e) {
      print('[CIVIC ERROR] Unexpected: $e');
      errorMessage.value = 'Unexpected error: $e';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /// Get Civic user profile using stored access token
  Future<Map<String, dynamic>?> getUserInfo() async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      print('[CIVIC ERROR] Token is null');
      return null;
    }

    try {
      final response = await http.get(
        Uri.parse('$CIVIC_ISSUER/oauth/userinfo'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print(
          '[CIVIC ERROR] Failed to fetch user info: ${response.statusCode}',
        );
        return null;
      }
    } catch (e) {
      print('[CIVIC ERROR] Fetch user info error: $e');
      return null;
    }
  }

  /// Check if user is already authenticated
  Future<bool> isAuthenticated() async {
    final token = await _secureStorage.read(key: 'access_token');
    return token != null;
  }

  /// Logout and clear secure storage
  Future<void> logout() async {
    await _secureStorage.deleteAll();
    Get.offAllNamed(AppRoutes.login); // Navigate to login screen
  }
}
