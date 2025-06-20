import 'package:civic_auth_flutter/screens/home_screen.dart';
import 'package:civic_auth_flutter/screens/login_screen.dart';
import 'package:civic_auth_flutter/screens/splash_screen.dart';
import 'package:get/get_navigation/src/routes/get_route.dart';

class AppRoutes {
  static const String splash = '/';
  static const String home = '/home';

  // Add more routes here as needed
  static const String login = '/login';
  static const String settings = '/settings';
  static final List<GetPage> pages = [
    GetPage(name: splash, page: () => const SplashScreen()),
    GetPage(name: home, page: () => HomeScreen()),
    GetPage(name: login, page: () => LoginScreen()),
  ];
}
