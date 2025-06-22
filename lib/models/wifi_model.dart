class WifiModel {
  final String ssid;
  final String? password;
  final String description;
  final WifiLocation location;

  WifiModel({
    required this.ssid,
    required this.description,
    required this.location,
    this.password,
  });

  factory WifiModel.fromJson(Map<String, dynamic> json) {
    return WifiModel(
      ssid: json['ssid'] ?? 'Unknown',
      password: json['password'],
      description: json['description'] ?? '',
      location: WifiLocation.fromJson(json['location']),
    );
  }

  Map<String, dynamic> toJson() => {
    'ssid': ssid,
    'password': password,
    'description': description,
    'location': location.toJson(),
  };
}

class WifiLocation {
  final String type;
  final List<double> coordinates;
  final String address;

  WifiLocation({
    required this.type,
    required this.coordinates,
    required this.address,
  });

  factory WifiLocation.fromJson(Map<String, dynamic> json) {
    return WifiLocation(
      type: json['type'] ?? 'Point',
      coordinates:
          (json['coordinates'] as List<dynamic>)
              .map((e) => e.toDouble())
              .toList()
              .cast<double>(),
      address: json['address'] ?? 'Unknown address',
    );
  }

  Map<String, dynamic> toJson() => {
    'type': type,
    'coordinates': coordinates,
    'address': address,
  };
}
