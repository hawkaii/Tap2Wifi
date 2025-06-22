# Tap2Wifi: Seamless, Secure, and Smart WiFi Onboarding

## 🚀 Hackathon Pitch: The Next Evolution in WiFi Access

Imagine walking into a café, co-working space, or airport and connecting to secure WiFi in seconds—no more awkwardly asking for passwords, no more clunky captive portals, and no more worrying about security. **Tap2Wifi** is our hackathon project that aims to revolutionize the way users onboard to WiFi networks by making the process frictionless, secure, and intelligent.

---

## 🎯 Our Vision

- **Frictionless Experience**: Users connect to WiFi as easily as tapping a button—no forms, no shared passwords, no hassle.
- **Smart Onboarding**: `The system automatically authenticates users based on their identity (Civic OAuth, social login, device fingerprint, or QR code), matching the right access level for every environment.
- **Enterprise & Public-Ready**: Designed for both large venues and small businesses, with customization and analytics to power smarter decision-making.
- **Privacy First**: Data is encrypted end-to-end, with users in control of what they share.
- **AI-Enhanced Connectivity**: Proactive, intelligent connection management using cutting-edge AI.

---

## 💡 Key Features & Innovations

### 1. **Civic OAuth for Secure, Decentralized Identity**

We leverage **Civic OAuth** to authenticate users securely and privately. Unlike traditional email or social logins, Civic allows users to prove their identity using decentralized, blockchain-powered credentials—no passwords shared, no personal data stored centrally.
---

### 2. **AI-Powered Travel Recommendations (Gemini AI Integration)**

Tap2Wifi now features **AI-powered travel recommendations** using Google Gemini AI. This enhancement enables users to discover interesting stops (landmarks, attractions, etc.) between two locations, with each stop showing nearby WiFi networks for seamless connectivity.

**Key Features:**
- **Gemini AI Integration:** The backend uses Google Gemini AI to generate travel recommendations and suggest stops along a route.
- **WiFi Network Data:** For each recommended stop, users can view available WiFi networks nearby.
- **New API Endpoints:**
  - `GET /api/gemini/recommendstops`: Returns recommended stops between two coordinates.
  - `GET /api/gemini/recommendstopswifi`: Combines stop recommendations with nearby WiFi network data.
  - `POST /api/wifi/nearby/stops`: Lists WiFi networks near specified stops.

> **Note:** These features are currently implemented in the backend and can be explored by visiting the backend repository: [https://github.com/hawkaii/wifi-golang-backend](https://github.com/hawkaii/wifi-golang-backend). Frontend integration is in progress.

---

### 3. **Community WiFi Archives & Seamless Connection**

Tap2Wifi maintains a public archive of WiFi networks, where anyone can upload details about available WiFi hotspots (such as SSID, location, and access info). Authenticated users can browse these archives and connect to a listed WiFi network after confirming their physical location, ensuring secure and relevant access.

**How it works:**
- Anyone can contribute by uploading WiFi details to the public archive, helping expand coverage for all users.
- Users authenticate through the app and confirm their current location to access and connect to nearby WiFi networks from the archive.
- The app verifies location to prevent misuse and ensure users connect only to relevant, available networks.

**Why Community Archives Matter:**
- **Always-on connectivity**: Users can find and connect to WiFi wherever they go, reducing reliance on mobile data.
- **Crowdsourced coverage**: The archive grows as more people contribute, making WiFi access more universal.
- **Empowered users**: Authenticated access and location checks keep connections secure and relevant.
- **Travel and emergencies**: Users can stay connected in new places or when mobile data fails, thanks to the shared knowledge base.

---

**Benefits:**
- **Always-on experience**: Less frustration from dropped connections or slow downloads.
- **Smart bandwidth usage**: Downloads scheduled when network is uncongested.
- **Enhanced satisfaction** for commuters, travelers, or anyone on the go.

---

## 🛠️ About the Project: GoLang Backend

Our backend is built from the ground up in **Go (Golang)** for performance, reliability, and scalability.

### Why Go?

- **Concurrency**: Handles hundreds of simultaneous authentication and payment requests with Go’s goroutines and channels.
- **Performance**: Compiled, statically typed, and incredibly fast—ideal for real-time networking and transactional workflows.
- **Simplicity & Safety**: Clean syntax, strong typing, and built-in error handling mean fewer bugs and greater maintainability.
- **Cloud Native**: Go is the backbone of modern infrastructure (Docker, Kubernetes, etc.), making our solution easy to deploy at scale.

### Backend Features

- **RESTful API**: All WiFi onboarding, payment, and AI integration actions are exposed via clean, well-documented REST APIs.
- **Secure Authentication**: Civic OAuth, OAuth2, JWT tokens, and optional SSO integration.
- **User & Session Management**: Robust user model with device fingerprinting, Civic-based identity, session expiry, and active connection tracking.
- **Role-Based Access Control (RBAC)**: Enforces different permissions for guests, staff, and admins.
- **AI-Driven Recommendations**: Integrates with Gemini AI for journey prediction and data prefetch.
- **Logging & Analytics**: Streams anonymized connection and payment data for analytics dashboards.
- **Pluggable Integrations**: Easily connect external CRMs, marketing tools, or IoT systems.

---

## 📐 Sample Architecture

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

## 🌈 Why This Matters

- **For Users**: No more WiFi frustration—just open, tap, pay (if needed), and surf, with seamless connectivity even on the move.
- **For Venues**: Smarter, safer, and more engaging WiFi means happier customers, better insights, and monetization opportunities.
- **For the Hackathon**: We’re solving a real, universal pain point with innovation, solid engineering, and a vision for scale.

---

## 🏗️ How to Run (Development)

1. **Clone the Repo**
   ```sh
   git clone https://github.com/hawkaii/wifi-golang-backend.git
   cd wifi-golang-backend
   ```

2. **Set Up Environment**
   - Copy `.env.example` to `.env` and fill in your config (Civic OAuth keys, UPI gateway details, Gemini AI API, DB, etc).

3. **Run the Backend**
   ```sh
   go run main.go
   ```

4. **API Docs**
   - Open `http://localhost:8080/docs` for Swagger UI (if enabled).

---

## 🤝 Contributing

We welcome contributions! Fork the repo, make your changes, and submit a PR. For major features or suggestions, open an issue to discuss your idea.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

> **Built with Go, fueled by caffeine, and inspired by the need for seamless, secure, and smart WiFi everywhere.**