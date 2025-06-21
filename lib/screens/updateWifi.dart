import 'package:flutter/material.dart';

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
  final _locationController = TextEditingController();

  bool _isLoading = false;
  bool _obscurePassword = true;

  @override
  void dispose() {
    _wifiNameController.dispose();
    _passwordController.dispose();
    _descriptionController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _submitWiFiData() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    // Simulate API call - replace with your actual database update logic
    try {
      await Future.delayed(
        const Duration(seconds: 2),
      ); // Simulating network delay

      // Here you would make your actual API call
      // Example:
      // final response = await http.post(
      //   Uri.parse('YOUR_API_ENDPOINT'),
      //   headers: {'Content-Type': 'application/json'},
      //   body: json.encode({
      //     'wifiName': _wifiNameController.text.trim(),
      //     'password': _passwordController.text.trim(),
      //     'description': _descriptionController.text.trim(),
      //     'location': _locationController.text.trim(),
      //   }),
      // );

      // For now, we'll just show success
      _showSuccessDialog();
      _clearForm();
    } catch (e) {
      _showErrorDialog('Failed to save WiFi data: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _clearForm() {
    _wifiNameController.clear();
    _passwordController.clear();
    _descriptionController.clear();
    _locationController.clear();
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green),
              SizedBox(width: 8),
              Text('Success'),
            ],
          ),
          content: const Text('WiFi information has been saved successfully!'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
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
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add WiFi Network'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 2,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),

              // WiFi Name Field
              TextFormField(
                controller: _wifiNameController,
                decoration: const InputDecoration(
                  labelText: 'WiFi Network Name',
                  hintText: 'Enter the WiFi network name (SSID)',
                  prefixIcon: Icon(Icons.wifi),
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter the WiFi network name';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 16),

              // Password Field
              TextFormField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                decoration: InputDecoration(
                  labelText: 'WiFi Password',
                  hintText: 'Enter the WiFi password',
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
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter the WiFi password';
                  }
                  if (value.length < 4) {
                    return 'Password must be at least 4 characters long';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 16),

              // Description Field
              TextFormField(
                controller: _descriptionController,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Description',
                  hintText: 'Enter a description for this WiFi network',
                  prefixIcon: Icon(Icons.description),
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter a description';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 16),

              // Location Field
              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(
                  labelText: 'Location/Place',
                  hintText: 'Enter the location where this WiFi is available',
                  prefixIcon: Icon(Icons.location_on),
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter the location';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 24),

              // Submit Button
              ElevatedButton(
                onPressed: _isLoading ? null : _submitWiFiData,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child:
                    _isLoading
                        ? const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            ),
                            SizedBox(width: 12),
                            Text('Saving...'),
                          ],
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

              const SizedBox(height: 16),

              // Clear Button
              OutlinedButton(
                onPressed: _isLoading ? null : _clearForm,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
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
