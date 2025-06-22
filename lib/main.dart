import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'app_routes.dart';
import 'services/auth_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize AuthService once and globally
  final authService = Get.put(AuthService());

  runApp(MyApp(authService: authService));
}

class MyApp extends StatelessWidget {
  final AuthService authService;

  const MyApp({super.key, required this.authService});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Civic Auth Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.blue),
      home: AuthGate(authService: authService),
      getPages: AppRoutes.pages,
    );
  }
}

class AuthGate extends StatefulWidget {
  final AuthService authService;

  const AuthGate({super.key, required this.authService});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  @override
  void initState() {
    super.initState();
    _checkAndAuthenticate();
  }

  Future<void> _checkAndAuthenticate() async {
    final isLoggedIn = await widget.authService.isAuthenticated();

    if (isLoggedIn) {
      Get.offAllNamed(AppRoutes.home); // User already logged in
    } else {
      final success = await widget.authService.signIn(); // Trigger Civic UI
      if (success) {
        Get.offAllNamed(AppRoutes.home);
      } else {
        Get.snackbar(
          'Auth Failed',
          widget.authService.errorMessage.value,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: CircularProgressIndicator()));
  }
}
