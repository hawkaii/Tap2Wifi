import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

import '../services/api_services.dart';

class WiFiEntryPage extends StatefulWidget {
  const WiFiEntryPage({super.key});

  @override
  State<WiFiEntryPage> createState() => _WiFiEntryPageState();
}

class _WiFiEntryPageState extends State<WiFiEntryPage> {
  final _formKey = GlobalKey<FormState>();
  final _wifiNameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _descriptionController = TextEditingController();

  bool _isLoading = false;
  bool _obscurePassword = true;
  Position? _currentPosition;

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
  }

  @override
  void dispose() {
    _wifiNameController.dispose();
    _passwordController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _getCurrentLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        _showErrorDialog('Please enable location services.');
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          _showErrorDialog('Location permission denied.');
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        _showErrorDialog('Location permission permanently denied.');
        return;
      }

      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      setState(() {
        _currentPosition = position;
      });
    } catch (e) {
      _showErrorDialog('Failed to get location: $e');
    }
  }

  Future<void> submitWiFiDataToServer() async {
    if (!_formKey.currentState!.validate() || _isLoading) return;

    if (_currentPosition == null) {
      _showErrorDialog("Unable to access current location.");
      return;
    }

    setState(() => _isLoading = true);

    final wifiData = {
      "ssid": _wifiNameController.text.trim(),
      "password": _passwordController.text.trim(),
      "description": _descriptionController.text.trim(),
      "location": {
        "type": "Point",
        "coordinates": [
          _currentPosition!.longitude,
          _currentPosition!.latitude,
        ],
        "address": "", // Empty as we removed the field
      },
    };

    try {
      final response = await ApiService.postRequest(
        'api/wifi/scan',
        wifiData,
        headers: {'Authorization': 'Bearer testtoken'},
      );

      print('[SUCCESS] WiFi data posted: $response');
      _showSuccessDialog();
      _clearForm();
    } catch (e) {
      print('[ERROR] Failed to post WiFi data: $e');
      _showErrorDialog('Failed to save WiFi data: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _clearForm() {
    _wifiNameController.clear();
    _passwordController.clear();
    _descriptionController.clear();
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder:
          (_) => AlertDialog(
            title: const Row(
              children: [
                Icon(Icons.check_circle, color: Colors.green),
                SizedBox(width: 8),
                Text('Success'),
              ],
            ),
            content: const Text(
              'WiFi information has been saved successfully!',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('OK'),
              ),
            ],
          ),
    );
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder:
          (_) => AlertDialog(
            title: const Row(
              children: [
                Icon(Icons.error, color: Colors.red),
                SizedBox(width: 8),
                Text('Error'),
              ],
            ),
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
      appBar: AppBar(
        title: const Text('Add WiFi Network'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _wifiNameController,
                decoration: const InputDecoration(
                  labelText: 'WiFi Network Name',
                  prefixIcon: Icon(Icons.wifi),
                  border: OutlineInputBorder(),
                ),
                validator:
                    (value) =>
                        value == null || value.trim().isEmpty
                            ? 'Enter SSID'
                            : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                decoration: InputDecoration(
                  labelText: 'WiFi Password',
                  prefixIcon: const Icon(Icons.lock),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword
                          ? Icons.visibility
                          : Icons.visibility_off,
                    ),
                    onPressed: () {
                      setState(() {
                        _obscurePassword = !_obscurePassword;
                      });
                    },
                  ),
                  border: const OutlineInputBorder(),
                ),
                validator:
                    (value) =>
                        value == null || value.length < 4
                            ? 'Min 4 characters'
                            : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Description',
                  prefixIcon: Icon(Icons.description),
                  border: OutlineInputBorder(),
                ),
                validator:
                    (value) =>
                        value == null || value.trim().isEmpty
                            ? 'Enter a description'
                            : null,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : submitWiFiDataToServer,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child:
                    _isLoading
                        ? const SizedBox(
                          height: 24,
                          width: 24,
                          child: CircularProgressIndicator(color: Colors.white),
                        )
                        : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.save),
                            SizedBox(width: 8),
                            Text('Save WiFi Information'),
                          ],
                        ),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: _isLoading ? null : _clearForm,
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.clear),
                    SizedBox(width: 8),
                    Text('Clear Form'),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
