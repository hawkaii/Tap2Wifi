import 'dart:convert';

import 'package:civic_auth_flutter/app_routes.dart';
import 'package:civic_auth_flutter/services/api_services.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;

import '../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<Map<String, dynamic>> _searchResults = [];
  bool _isSearching = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  // Function to call Ola Maps Places API
  Future<void> _searchPlaces(String query) async {
    if (query.isEmpty) {
      setState(() {
        _searchResults = [];
      });
      return;
    }

    setState(() {
      _isSearching = true;
    });

    try {
      final String url =
          'https://api.olamaps.io/places/v1/geocode?address=$query&api_key=wgzW2r3gXkrfVRmstkPJf3RKOPyjzKmn34xh7kHQ';

      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        List<Map<String, dynamic>> results = [];

        if (data['geocodingResults'] != null) {
          for (var result in data['geocodingResults']) {
            results.add({
              'address': result['formattedAddress'] ?? 'Unknown Address',
              'latitude': result['geometry']?['location']?['lat'] ?? 0.0,
              'longitude': result['geometry']?['location']?['lng'] ?? 0.0,
            });
          }
        }

        setState(() {
          _searchResults = results;
          _isSearching = false;
        });
      } else {
        setState(() {
          _searchResults = [];
          _isSearching = false;
        });
        Get.snackbar('Error', 'Failed to fetch locations');
      }
    } catch (e) {
      setState(() {
        _searchResults = [];
        _isSearching = false;
      });
      Get.snackbar('Error', 'Network error occurred');
    }
  }

  @override
  Widget build(BuildContext context) {
    // Inject AuthService into GetX.
    final AuthService authService = Get.put(AuthService(), permanent: true);

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.black.withOpacity(0.5),
          title: Text(
            "Tap 2 WiFi",
            style: TextStyle(
              fontFamily: 'poppins',
              fontSize: 26,
              fontWeight: FontWeight.w600,
            ),
          ),
          centerTitle: true,
          bottom: TabBar(
            tabs: [
              Tab(icon: Icon(Icons.wifi_protected_setup), text: "Update WiFi"),
              Tab(icon: Icon(Icons.wifi), text: "Get WiFi"),
            ],
            indicatorColor: Colors.black,
            labelColor: Colors.green,
            unselectedLabelColor: Colors.black,
            labelStyle: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w500,
              fontFamily: 'poppins',
            ),
          ),
        ),
        body: TabBarView(
          children: [
            // Update WiFi Tab
            _buildUpdateWiFiTab(authService),
            // Get WiFi Tab
            _buildGetWiFiTab(authService),
          ],
        ),
      ),
    );
  }

  Widget _buildUpdateWiFiTab(AuthService authService) {
    return Stack(
      children: [
        // 🎨 Overlay to darken background
        Container(color: Colors.black.withOpacity(0.5)),

        // 📲 Update WiFi UI
        Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 30),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // 🛡️ Update WiFi Icon & Title
                const Icon(
                  Icons.wifi_protected_setup,
                  size: 80,
                  color: Colors.white,
                ),
                const SizedBox(height: 20),
                const Text(
                  'Update WiFi Credentials',
                  style: TextStyle(
                    fontSize: 28,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 10),
                const Text(
                  'Authenticate to update WiFi settings',
                  style: TextStyle(color: Colors.white70, fontSize: 16),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 40),

                // 🔐 Update WiFi Button
                Obx(
                  () =>
                      authService.isLoading.value
                          ? const CircularProgressIndicator(color: Colors.white)
                          : ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.orange,
                              foregroundColor: Colors.white,
                              minimumSize: const Size(double.infinity, 50),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            onPressed: () async {
                              final success = await authService.signIn();
                              if (success) {
                                Get.offAllNamed(AppRoutes.home);
                              }
                            },
                            icon: const Icon(Icons.wifi_protected_setup),
                            label: const Text("Authenticate for Update"),
                          ),
                ),

                // ❗ Error Message
                Obx(
                  () =>
                      authService.errorMessage.value.isNotEmpty
                          ? Padding(
                            padding: const EdgeInsets.only(top: 20),
                            child: Text(
                              authService.errorMessage.value,
                              style: const TextStyle(color: Colors.redAccent),
                              textAlign: TextAlign.center,
                            ),
                          )
                          : const SizedBox.shrink(),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildGetWiFiTab(AuthService authService) {
    return Stack(
      children: [
        // 🎨 Overlay to darken background
        Container(color: Colors.black.withOpacity(0.5)),

        // 📲 Get WiFi UI
        Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // 🛡️ Get WiFi Icon & Title
                const Icon(Icons.wifi, size: 80, color: Colors.white),
                const SizedBox(height: 20),
                const Text(
                  'Get WiFi Access',
                  style: TextStyle(
                    fontSize: 28,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 10),
                const Text(
                  'Search location and authenticate to connect to WiFi',
                  style: TextStyle(color: Colors.white70, fontSize: 16),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 30),

                // 🔍 Search Field
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.9),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search location for WiFi...',
                      prefixIcon: Icon(Icons.search, color: Colors.grey[600]),
                      suffixIcon:
                          _searchController.text.isNotEmpty
                              ? IconButton(
                                icon: Icon(
                                  Icons.clear,
                                  color: Colors.grey[600],
                                ),
                                onPressed: () {
                                  _searchController.clear();
                                  setState(() {
                                    _searchResults = [];
                                  });
                                },
                              )
                              : null,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                    onChanged: (value) {
                      setState(() {});
                      _searchPlaces(value);
                    },
                  ),
                ),
                const SizedBox(height: 20),

                // 📍 Search Results
                if (_isSearching)
                  const CircularProgressIndicator(color: Colors.white)
                else if (_searchResults.isNotEmpty)
                  Container(
                    height: 200,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: ListView.builder(
                      itemCount: _searchResults.length,
                      itemBuilder: (context, index) {
                        final result = _searchResults[index];
                        return ListTile(
                          leading: const Icon(
                            Icons.wifi_find,
                            color: Colors.green,
                          ),
                          title: Text(
                            result['address'],
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          subtitle: Text(
                            'Lat: ${result['latitude'].toStringAsFixed(4)}, Lng: ${result['longitude'].toStringAsFixed(4)}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                          onTap: () async {
                            _searchController.text = result['address'];
                            setState(() {
                              _searchResults = [];
                            });

                            print(
                              '[INFO] Location selected: ${result['address']}',
                            );

                            Get.snackbar(
                              'Location Selected',
                              'Fetching WiFi for: ${result['address']}',
                              backgroundColor: Colors.blue,
                              colorText: Colors.white,
                            );

                            try {
                              final wifiData = await ApiService.getRequest(
                                '/api/wifi/nearby',
                                queryParams: {
                                  'latitude': result['latitude'].toString(),
                                  'longitude': result['longitude'].toString(),
                                },
                              );

                              print('[SUCCESS] WiFi data received: $wifiData');

                              if (wifiData == null || wifiData.isEmpty) {
                                print(
                                  '[WARN] No WiFi found for selected location.',
                                );

                                Get.snackbar(
                                  'No WiFi Found',
                                  'No nearby WiFi found for this location.',
                                  backgroundColor: Colors.orange,
                                  colorText: Colors.white,
                                );
                                return;
                              }

                              // ✅ Show data in a dialog
                              showDialog(
                                context: context,
                                builder:
                                    (_) => AlertDialog(
                                      title: Text('Nearby WiFi'),
                                      content:
                                          wifiData is List
                                              ? SizedBox(
                                                width: double.maxFinite,
                                                child: ListView.builder(
                                                  shrinkWrap: true,
                                                  itemCount: wifiData.length,
                                                  itemBuilder: (
                                                    context,
                                                    index,
                                                  ) {
                                                    final item =
                                                        wifiData[index];
                                                    return ListTile(
                                                      title: Text(
                                                        item['ssid'] ??
                                                            'Unknown',
                                                      ),
                                                      subtitle: Text(
                                                        'Signal: ${item['signal'] ?? 'N/A'}',
                                                      ),
                                                    );
                                                  },
                                                ),
                                              )
                                              : Text(wifiData.toString()),
                                      actions: [
                                        TextButton(
                                          onPressed:
                                              () => Navigator.pop(context),
                                          child: Text('Close'),
                                        ),
                                      ],
                                    ),
                              );
                            } catch (e) {
                              print('[ERROR] Failed to fetch WiFi data: $e');

                              Get.snackbar(
                                'Error',
                                e.toString(),
                                backgroundColor: Colors.red,
                                colorText: Colors.white,
                              );
                            }
                          },
                        );
                      },
                    ),
                  ),
                const SizedBox(height: 20),

                // 🔐 Get WiFi Button
                // Obx(
                //   () =>
                //       authService.isLoading.value
                //           ? const CircularProgressIndicator(color: Colors.white)
                //           : ElevatedButton.icon(
                //             style: ElevatedButton.styleFrom(
                //               backgroundColor: Colors.green,
                //               foregroundColor: Colors.white,
                //               minimumSize: const Size(double.infinity, 50),
                //               shape: RoundedRectangleBorder(
                //                 borderRadius: BorderRadius.circular(12),
                //               ),
                //             ),
                //             onPressed: () async {
                //               final success = await authService.signIn();
                //               if (success) {
                //                 Get.offAllNamed(AppRoutes.home);
                //               }
                //             },
                //             icon: const Icon(Icons.wifi),
                //             label: const Text("Authenticate for Access"),
                //           ),
                // ),

                // ❗ Error Message
                Obx(
                  () =>
                      authService.errorMessage.value.isNotEmpty
                          ? Padding(
                            padding: const EdgeInsets.only(top: 20),
                            child: Text(
                              authService.errorMessage.value,
                              style: const TextStyle(color: Colors.redAccent),
                              textAlign: TextAlign.center,
                            ),
                          )
                          : const SizedBox.shrink(),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
