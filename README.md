# Tap2Wifi: Revolutionizing Public Wi-Fi Access

Tap2Wifi is an innovative solution designed to make public Wi-Fi access seamless, secure, and smart—empowering users to connect instantly while providing robust tools for venues and network providers. With a feature-rich mobile app and a high-performance Golang backend, Tap2Wifi eliminates traditional connectivity hurdles, ensuring you’re always just a tap away from reliable internet.

---

## Table of Contents

- [Inspiration](#inspiration)
- [What It Does](#what-it-does)
- [Features](#features)
- [How We Built It](#how-we-built-it)
- [Backend: wifi-golang-backend](#backend-wifi-golang-backend)
- [Challenges We Faced](#challenges-we-faced)
- [Accomplishments](#accomplishments)
- [What We Learned](#what-we-learned)
- [What’s Next](#whats-next)
- [Sample Architecture](#sample-architecture)
- [How to Run (Development)](#how-to-run-development)
- [Contributing](#contributing)
- [License](#license)

---

## Inspiration

We were driven by a simple but universal frustration: unreliable or unavailable Wi-Fi in public spaces. Whether you’re paying via UPI, working remotely, or just relaxing at a café, struggling to get online is a common pain. Tap2Wifi is our answer—removing these hurdles so you can connect effortlessly anywhere.

---

## What It Does

Tap2Wifi is more than just a Wi-Fi archive. It’s a smart, user-focused platform that:

- **Authenticates proximity:** Only reveals hotspot credentials if you’re within 1 km, ensuring only nearby users can connect.
- **Dynamic search:** Find all available Wi-Fi networks in a 10 km radius, including detailed hotspot info.
- **Offline access:** Optionally downloads an encrypted, local database of Wi-Fi networks—so you can connect even without mobile data.
- **AI-powered recommendations:** Enter two locations and let Tap2Wifi (via Gemini AI) suggest optimal stops with good Wi-Fi along your route.
- **Secure onboarding:** OAuth PKCE and robust middleware keep your data and access safe.

---

## Features

### Localized Authentication

- Verifies that users are physically close to the hotspot before sharing access information.
- Prevents remote misuse of shared credentials.

### Dynamic & Offline Search

- Search Wi-Fi by location, name, or proximity.
- “Always Connect” downloads encrypted local Wi-Fi data for offline use.

### AI-Powered Recommendations

- Uses the Gemini API to suggest travel stops with Wi-Fi between two points.
- Backend endpoints for AI recommendations:
  - `GET /api/gemini/recommendstops`
  - `GET /api/gemini/recommendstopswifi`
  - `POST /api/wifi/nearby/stops`
- See the backend repo: [hawkaii/wifi-golang-backend](https://github.com/hawkaii/wifi-golang-backend)
- **Production Backend Server:** [https://wifi-golang-backend.onrender.com](https://wifi-golang-backend.onrender.com)

### Community Wi-Fi Archive

- Anyone can contribute hotspot details (SSID, password, location) to the public archive.
- Authenticated users can browse and connect to nearby networks.
- Location checks and authentication enhance security and relevance.

### Security & Privacy

- End-to-end encryption on user data.
- OAuth PKCE flow with custom middleware for secure, decentralized authentication.
- No passwords exchanged in plain text.

---

## How We Built It

### Mobile Frontend

- **Framework:** Flutter (Dart) for cross-platform, responsive UI.
- **Authentication:** OAuth PKCE and secure token management.
- **Location & Permissions:** Real-time GPS and permissions handling, with graceful error states for denied or disabled location access.
- **Offline mode:** Encrypted, downloadable Wi-Fi database.

### Backend: [hawkaii/wifi-golang-backend](https://github.com/hawkaii/wifi-golang-backend)

- **Production Server:** [https://wifi-golang-backend.onrender.com](https://wifi-golang-backend.onrender.com)
- **Language:** Golang for high performance and scalability.
- **Database:** MongoDB with advanced geospatial queries (Haversine, `$geoWithin`, `$centerSphere`).
- **Authentication:** Civic OAuth, OAuth2 PKCE, JWT, SSO readiness.
- **AI Integration:** Connects to Gemini API for intelligent journey and Wi-Fi stop recommendations.
- **Secure Middleware:** Custom middleware for PKCE, CSRF protection, and secure redirect URIs.
- **Cloud-Ready:** Uses environment secrets (`godotenv`, `os.Getenv`) and singleton MongoDB clients for safe, scalable deployment.
- **API Documentation:** Swagger UI at `/docs`.

---

## Challenges We Faced

### Frontend

- Complex platform permissions and handling user denials.
- Managing dynamic search scenarios and error states (no Wi-Fi, disabled location, API failures).
- Merging across branches with non-source-controlled files.
- Adapting to breaking changes in production APIs.

### Backend

- Refactoring from global state to modular, dependency-injected handlers.
- Overhauling authentication from test tokens to OAuth PKCE.
- Managing secrets and singleton DB clients in cloud environments.
- Handling diverse deployment constraints (ports, logs, etc).

---

## Accomplishments

- Real-time location-based Wi-Fi access with secure OAuth authentication.
- Scalable backend with robust middleware and geospatial search.
- Encrypted, offline-accessible hotspot data.
- AI-driven route recommendations and Wi-Fi stop suggestions.
- Streamlined merge and CI/CD flows for smooth team collaboration.

---

## What We Learned

- **User-centric design** is crucial for real-world adoption.
- **Technical growth:** Mastered Flutter, robust backend patterns, and secure authentication.
- **Agile processes:** Iterative development, frequent testing, and fast adaptation to change are key.
- **AI and data-driven UX:** Gemini API integration opens new horizons for predictive connectivity.

---

## What’s Next

- **Frontend AI integration:** Complete seamless in-app experience for route recommendations.
- **More coverage:** Expand community-driven archive and enable real-time hotspot updates.
- **Analytics:** Add network performance metrics, user reviews, and historical reliability data.
- **Predictive connectivity:** Personalized, AI-driven network suggestions.
- **Security & scale:** Ongoing improvements to protect users and handle growth.
- **Ecosystem partnerships:** Work with civic and commercial partners to make public Wi-Fi universally accessible.

---

## Sample Architecture

```
+------------+         +-------------------+       +--------------------+
|  User App  | <-----> |  Go Backend API   | <---->| WiFi Controller(s) |
+------------+         +-------------------+       +--------------------+
       |                      |   ^                         |
       |                      v   |                         |
       |                 Civic OAuth                        |
       |                      |                             |
       |                UPI Gateway                        |
       |                      |                             |
       |                 Gemini AI                          |
       |                      |                             |
       +----------------> Database <------------------------+
```

---

## How to Run (Development)

### Backend

1. **Clone the Backend Repo**
   ```sh
   git clone https://github.com/hawkaii/wifi-golang-backend.git
   cd wifi-golang-backend
   ```

2. **Set Up Environment**
   - Copy `.env.example` to `.env` and fill in Civic OAuth keys, UPI, Gemini API, database, etc.

3. **Run the Backend Locally**
   ```sh
   go run main.go
   ```

4. **Production Backend Server**
   - Use [https://wifi-golang-backend.onrender.com](https://wifi-golang-backend.onrender.com)

5. **API Docs**
   - Open [https://wifi-golang-backend.onrender.com/docs](https://wifi-golang-backend.onrender.com/docs) (Swagger UI if enabled).

### Frontend

_Coming soon: detailed mobile app setup!_

---

## Contributing

We welcome contributions! Fork the repo, make your changes, and submit a PR. For major features or suggestions, open an issue first to discuss your idea.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

> **Built with Go, Dart, and a passion for seamless, secure public Wi-Fi.**
