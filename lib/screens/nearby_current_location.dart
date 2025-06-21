import 'dart:async';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import '../services/api_services.dart';

class WifiNearbyFromCurrentLocation extends StatefulWidget {
  const WifiNearbyFromCurrentLocation({super.key});

  @override
  State<WifiNearbyFromCurrentLocation> createState() =>
      _WifiNearbyFromCurrentLocationState();
}

class _WifiNearbyFromCurrentLocationState
    extends State<WifiNearbyFromCurrentLocation> {
  bool _isLoading = true;
  String _address = 'Fetching current location...';
  List<dynamic> _wifiList = [];

  @override
  void initState() {
    super.initState();
    _loadWifiFromCurrentLocation();
  }

  Future<void> _loadWifiFromCurrentLocation() async {
    try {
      final hasPermission = await _checkLocationPermission();
      if (!hasPermission) return;

      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      final latitude = position.latitude;
      final longitude = position.longitude;

      print('[INFO] Current location: lat=$latitude, lng=$longitude');

      final wifiData = await ApiService.getRequest(
        '/api/wifi/nearby',
        queryParams: {
          'latitude': latitude.toString(),
          'longitude': longitude.toString(),
        },
      );

      setState(() {
        _address =
            'Lat: ${latitude.toStringAsFixed(4)}, Lng: ${longitude.toStringAsFixed(4)}';
        _wifiList = wifiData ?? [];
        _isLoading = false;
      });

      print('[SUCCESS] WiFi data received: $_wifiList');
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      print('[ERROR] Failed to fetch WiFi data: $e');
      Get.snackbar(
        'Error',
        'Failed to fetch data: $e',
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    }
  }

  Future<bool> _checkLocationPermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await _showDialog('Please enable location services.');
      return false;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        await _showDialog('Location permission is denied.');
        return false;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      await _showDialog(
        'Location permission is permanently denied. Please enable it from settings.',
      );
      return false;
    }

    return true;
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nearby WiFi (Current Location)')),
      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _address,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _wifiList.isEmpty
                        ? const Text(
                          'No WiFi found nearby.',
                          style: TextStyle(color: Colors.redAccent),
                        )
                        : Expanded(
                          child: ListView.builder(
                            itemCount: _wifiList.length,
                            itemBuilder: (context, index) {
                              final wifi = _wifiList[index];
                              return ListTile(
                                leading: const Icon(
                                  Icons.wifi,
                                  color: Colors.green,
                                ),
                                title: Text(wifi['ssid'] ?? 'Unknown'),
                                subtitle: Text(
                                  'Signal: ${wifi['signal'] ?? 'N/A'}',
                                ),
                              );
                            },
                          ),
                        ),
                  ],
                ),
              ),
    );
  }
}
