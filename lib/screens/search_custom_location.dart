import 'dart:convert';
import 'package:civic_auth_flutter/services/api_services.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;

import '../services/auth_service.dart';

class SearchCustomLocation extends StatefulWidget {
  const SearchCustomLocation({super.key});

  @override
  State<SearchCustomLocation> createState() => _SearchCustomLocationState();
}

class _SearchCustomLocationState extends State<SearchCustomLocation> {
  final TextEditingController _searchController = TextEditingController();
  List<Map<String, dynamic>> _searchResults = [];
  bool _isSearching = false;
  final AuthService authService = Get.put(AuthService(), permanent: true);

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

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
            final lat = result['geometry']?['location']?['lat'] ?? 0.0;
            final lng = result['geometry']?['location']?['lng'] ?? 0.0;
            final formattedAddress =
                result['formattedAddress']?.toString().trim();

            results.add({
              'address':
                  (formattedAddress != null && formattedAddress.isNotEmpty)
                      ? formattedAddress
                      : 'Address not available',
              'latitude': lat,
              'longitude': lng,
              'rawLatLng':
                  'Lat: ${lat.toStringAsFixed(4)}, Lng: ${lng.toStringAsFixed(4)}',
            });
          }
        }

        if (!mounted) return;
        setState(() {
          _searchResults = results;
          _isSearching = false;
        });
      } else {
        if (!mounted) return;
        setState(() {
          _searchResults = [];
          _isSearching = false;
        });
        Get.snackbar('Error', 'Failed to fetch locations');
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _searchResults = [];
        _isSearching = false;
      });
      Get.snackbar('Error', 'Network error occurred');
    }
  }

  Future<void> _showDialog(String message) async {
    await showDialog(
      context: context,
      builder:
          (_) => AlertDialog(
            title: const Text('Permission Required'),
            content: Text(message),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('OK'),
              ),
            ],
          ),
    );
  }

  void _navigateToWifiListScreen(List<dynamic> wifiData, String location) {
    Get.to(() => WifiListScreen(wifiData: wifiData, location: location));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.teal,
        title: const Text(
          "Search WiFi on Custom Location",
          style: TextStyle(
            fontSize: 24,
            fontFamily: 'poppins',
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: Container(
        color: Colors.black.withOpacity(0.5),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
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
                if (_isSearching)
                  const CircularProgressIndicator()
                else if (_searchResults.isNotEmpty)
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
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
                            title: Text(result['address']),
                            subtitle: Text(result['rawLatLng'] ?? ''),
                            onTap: () async {
                              _searchController.text = result['address'];
                              setState(() {
                                _searchResults = [];
                              });

                              try {
                                final wifiData = await ApiService.getRequest(
                                  '/api/wifi/nearby',
                                  queryParams: {
                                    'latitude': result['latitude'].toString(),
                                    'longitude': result['longitude'].toString(),
                                  },
                                );

                                if (!mounted) return;

                                if (wifiData == null || wifiData.isEmpty) {
                                  Get.snackbar(
                                    'No WiFi Found',
                                    'No nearby WiFi found for this location.',
                                    backgroundColor: Colors.orange,
                                    colorText: Colors.white,
                                  );
                                  return;
                                }

                                _navigateToWifiListScreen(
                                  wifiData,
                                  result['address'],
                                );
                              } catch (e) {
                                if (!mounted) return;
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
                  ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class WifiListScreen extends StatelessWidget {
  final List<dynamic> wifiData;
  final String location;

  const WifiListScreen({
    Key? key,
    required this.wifiData,
    required this.location,
  }) : super(key: key);

  void _showAuthenticatingDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder:
          (_) => AlertDialog(
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: const [
                CircularProgressIndicator(),
                SizedBox(height: 20),
                Text(
                  'Authenticating and checking location.\nPlease wait...',
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
    );

    // Wait 3 seconds, then show password
    Future.delayed(const Duration(seconds: 3), () {
      Get.back(); // Close the progress dialog
      _showStaticPasswordDialog();
    });
  }

  void _showStaticPasswordDialog() {
    Get.defaultDialog(
      title: 'WiFi Password',
      middleText: 'Password: Tint@156',
      textConfirm: 'OK',
      confirmTextColor: Colors.white,
      onConfirm: () => Get.back(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("WiFi Near $location"),
        backgroundColor: Colors.teal,
      ),
      body: ListView.builder(
        itemCount: wifiData.length,
        itemBuilder: (context, index) {
          final wifi = wifiData[index];
          final double? distance = double.tryParse(
            wifi['distance']?.toString() ?? '',
          );

          return ListTile(
            leading: const Icon(Icons.wifi, color: Colors.green),
            title: Text(wifi['ssid'] ?? 'Unknown'),
            subtitle: Text('Description: ${wifi['description'] ?? 'N/A'}'),
            trailing: Text(
              distance != null
                  ? 'Distance: ${distance.toStringAsFixed(2)} m'
                  : 'Distance: N/A',
              style: const TextStyle(color: Colors.blueGrey),
            ),
            onTap: () => _showAuthenticatingDialog(context),
          );
        },
      ),
    );
  }
}
