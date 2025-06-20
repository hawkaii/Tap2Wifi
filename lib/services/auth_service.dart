import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../config/civic_config.dart';
import 'secure_storage_service.dart';

class AuthService {
  final FlutterAppAuth _appAuth = FlutterAppAuth();
  final SecureStorageService _secureStorage = SecureStorageService();

  /// 🔐 Sign in with Civic Auth
  Future<bool> signIn() async {
    try {
      final AuthorizationTokenResponse?
      result = await _appAuth.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          CIVIC_CLIENT_ID,
          CIVIC_REDIRECT_URI,
          serviceConfiguration: AuthorizationServiceConfiguration(
            authorizationEndpoint: '$CIVIC_ISSUER/oauth/auth',
            tokenEndpoint: '$CIVIC_ISSUER/oauth/token',
          ),
          scopes: CIVIC_SCOPES,
          // preferEphemeralSession: true, // Optional: Prevent Safari session caching on iOS
        ),
      );

      if (result != null && result.accessToken != null) {
        await _secureStorage.saveToken(result.accessToken!);
        return true;
      }
    } catch (e) {
      print('[CIVIC ERROR] Sign-in failed: $e');
    }
    return false;
  }

  /// 👤 Fetch user info using access token
  Future<Map<String, dynamic>?> getUserInfo() async {
    final token = await _secureStorage.getToken();
    if (token == null) {
      print('[CIVIC ERROR] Token is null');
      return null;
    }

    final response = await http.get(
      Uri.parse('$CIVIC_ISSUER/oauth/userinfo'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      try {
        return jsonDecode(response.body);
      } catch (e) {
        print('[CIVIC ERROR] Failed to decode user info: $e');
      }
    } else {
      print('[CIVIC ERROR] Failed to fetch user info: ${response.statusCode}');
    }

    return null;
  }

  /// 🔓 Logout user (clear stored token)
  Future<void> logout() async {
    await _secureStorage.clear();
    print('[CIVIC] User logged out.');
  }
}
