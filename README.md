<p align="center">
  <img src="assets/images/app_logo_1785056480414.png" width="150" alt="Aspect Move Logo" style="border-radius: 20px;" />
</p>

<h1 align="center">Aspect Move (AM)</h1>

<p align="center">
  <b>Ultra-Sleek Modern Real Estate & Luxury Property Mobile Application</b>
</p>

<p align="center">
  <a href="https://expo.dev/accounts/prem9880/projects/reactApp/builds/8e43fd2b-1916-4ed0-95f6-79adc7922466">
    <img src="https://img.shields.io/badge/Android_Build-APK_Ready-success?style=for-the-badge&logo=android" alt="APK Ready" />
  </a>
  <img src="https://img.shields.io/badge/Expo-SDK_54-000000?style=for-the-badge&logo=expo" alt="Expo SDK 54" />
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
</p>

---

## 📱 About Aspect Move

**Aspect Move (AM)** is a high-performance, premium real estate discovery app built with **React Native** and **Expo SDK 54**. It offers seamless property search, interactive category filtering, saved favorites, instant property listings publishing, and complete details views with direct agent contact actions.

<p align="center">
  <a href="https://expo.dev/accounts/prem9880/projects/reactApp/builds/8e43fd2b-1916-4ed0-95f6-79adc7922466">
    <b>📲 Download Latest Android APK →</b>
  </a>
</p>

---

## 🌟 Key Features

- 🎨 **Clean Light Theme Aesthetic**: Minimalist `#F8FAFC` slate theme, white rounded cards (`#FFFFFF`), bold typography, and zero-flicker route transitions.
- 🔍 **Instant Search & Category Filters**: Real-time property and city search with category chips (*All, Villa, Penthouse, Apartment, House*).
- 🏷️ **Smart INR Price Formatter**: Automatic currency formatting into Crores (`₹1.3Cr`) and Lakhs (`₹55L`) based on database listing prices.
- 🏠 **Horizontal Featured Carousels**: Full-bleed featured property cards with gradient overlays, type pills, and property specifications.
- ➕ **Center Floating Add Property Tab**: Prominent elevated circular (+) button for instant property creation directly synced to Supabase.
- ❤️ **Saved Favorite Properties**: One-tap optimistic bookmarking with real-time state synchronization.
- 📄 **Rich Property Details Screen**: High-res gallery banner, specs grid (Beds, Baths, Sqft), full description, and quick Call/Message agent buttons.
- 👤 **Redesigned User Profile**: Account statistics, settings menu options, notification toggles, and authentication state management.
- ⚡ **Pure JavaScript Codebase**: Built completely using clean, maintainable `.jsx` components and Expo Router v6 file-based navigation.

---

## 📸 App Architecture & Tab Layout

| Screen | Path | Description |
| :--- | :--- | :--- |
| **Home** | `app/(root)/(tabs)/index.jsx` | Header greeting, search bar with blue filter, featured carousel & listings feed. |
| **Search** | `app/(root)/(tabs)/search.jsx` | Full property search, interactive price range & bedroom count filter modal. |
| **Add Property** | `app/(root)/(tabs)/create.jsx` | Listing creation form with image URL, pricing, dimensions, and Supabase publishing. |
| **Saved** | `app/(root)/(tabs)/saved.jsx` | Bookmarked homes list with instant remove toggle and empty state UI. |
| **Profile** | `app/(root)/(tabs)/profile.jsx` | User account details, listing counters, preferences, and session controls. |
| **Details View** | `app/properties/[id].jsx` | Full-screen property showcase with specs, location tag, and agent contact actions. |
| **Auth** | `app/(auth)/sign_in.jsx` | Clean authentication screens with 6-digit OTP verification support. |

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React Native 0.81](https://reactnative.dev/) with [Expo SDK 54](https://expo.dev/) |
| **Navigation** | [Expo Router v6](https://docs.expo.dev/router/introduction/) (File-Based Routing) |
| **Database & API** | [Supabase](https://supabase.com/) (`@supabase/supabase-js`) |
| **Icons & UI** | [@expo/vector-icons (Ionicons)](https://icons.expo.fyi/) |
| **Styling** | React Native `StyleSheet` Design System Tokens |

---

## 📂 Project Structure

```text
reactApp/
├── app/
│   ├── (auth)/             # Sign In, Sign Up & OTP Verification
│   ├── (root)/             # Main Navigation Stack
│   │   └── (tabs)/         # 5 Tab Screens (Home, Search, Create, Saved, Profile)
│   ├── properties/         # Property Detail Dynamic Routes ([id].jsx)
│   ├── index.jsx           # Splash & Root Gatekeeper
│   └── _layout.jsx         # Root Layout & Providers
├── assets/
│   └── images/             # App Logo & Media Assets
├── context/                # Global Auth & App Contexts
├── hooks/                  # Custom Supabase & State Hooks (useProperties, useSavedProperties)
├── utils/                  # Supabase Client & Storage Adapters
├── app.json                # Expo Configuration
├── eas.json                # EAS Build Profiles
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (`v18.x` or higher)
- Expo Go app on your physical device (iOS/Android) or an Emulator

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PremBorde/Aspect_Move.git
   cd Aspect_Move
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   EXPO_PUBLIC_SUPABASE_KEY=your-supabase-anon-key
   ```

4. **Start the Metro Bundler**:
   ```bash
   npx expo start
   ```

5. **Run on Android / iOS**:
   - Press **`a`** for Android Emulator or **`i`** for iOS Simulator.
   - Or scan the QR code using the **Expo Go** app on your physical device.

---

## 📲 Android APK Build

Download the pre-compiled APK directly:
👉 **[Aspect Move Android Release APK](https://expo.dev/accounts/prem9880/projects/reactApp/builds/8e43fd2b-1916-4ed0-95f6-79adc7922466)**

To build a fresh APK using EAS CLI:
```bash
npx eas-cli build -p android --profile preview
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
