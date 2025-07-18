import 'package:civic_auth_flutter/screens/home_screen.dart';
import 'package:civic_auth_flutter/screens/login_screen.dart';
import 'package:civic_auth_flutter/screens/search_custom_location.dart';
import 'package:civic_auth_flutter/screens/splash_screen.dart';
import 'package:get/get_navigation/src/routes/get_route.dart';

class AppRoutes {
  static const String splash = '/';
  static const String home = '/home';
  static const String login = '/login';
  static const String searchcustomlocation = '/searchcustomlocation';
  static const String settings = '/settings';
  static final List<GetPage> pages = [
    GetPage(name: splash, page: () => const SplashScreen()),
    GetPage(name: home, page: () => HomeScreen()),
    GetPage(name: login, page: () => LoginScreen()),
    GetPage(name: searchcustomlocation, page: () => SearchCustomLocation()),
  ];
}
