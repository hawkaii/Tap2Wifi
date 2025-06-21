import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'https://wifi-golang-backend.onrender.com/';

  // Reusable GET request
  static Future<dynamic> getRequest(
    String endpoint, {
    Map<String, String>? queryParams,
  }) async {
    try {
      final uri = Uri.parse(
        '$baseUrl$endpoint',
      ).replace(queryParameters: queryParams);
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('GET request failed: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('GET request error: $e');
    }
  }

  // Reusable POST request
  static Future<dynamic> postRequest(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('POST request failed: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('POST request error: $e');
    }
  }
}
