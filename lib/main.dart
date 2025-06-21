import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'app_routes.dart';

void main() {
  runApp(const MyApp()); // ✅ main must be defined like this
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Civic Auth Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.blue),
      initialRoute: AppRoutes.splash,
      getPages: AppRoutes.pages,
    );
  }
}
