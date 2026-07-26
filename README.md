# Aspect Move (AM) 🏠✨

> **Aspect Move (AM)** is a high-performance, ultra-sleek, monochrome React Native mobile application for modern real estate discovery, property rentals, and luxury home listings.

![Aspect Move Banner](assets/images/app_logo_1785056480414.png)

---

## 🌟 Key Features

- 🖤 **Professional Black & White Design**: Pitch black background (`#000000`), sleek zinc card surfaces (`#18181B`), crisp typography, and smooth page transitions.
- 📱 **Floating Inset Navigation Bar**: Modern, pill-style floating bottom tab navigation with active icon feedback.
- 🔑 **Authentication Flow**: Clean Sign In & Sign Up user flows with First & Last Name row layouts, input validations, and inline error feedback.
- 📩 **6-Digit OTP Email Verification**: Built-in 6-digit auto-focusing verification boxes with paste support, backspace navigation, and countdown resend timer.
- ⚡ **Pure JavaScript Codebase**: Simple, beginner-friendly `.jsx` components without complex TypeScript interfaces.
- 🚀 **Expo Router v6 File-Based Routing**: Clean, modular route structure utilizing Expo SDK 54.

---

## 📸 Screen Overview

| Screen | Description |
| :--- | :--- |
| **Home (`/`)** | Minimalist dashboard introducing latest featured properties and listings. |
| **Search (`/search`)** | Location and property filter search interface. |
| **Saved (`/saved`)** | Bookmarked homes and saved user properties. |
| **Profile (`/profile`)** | User avatar, account details, and session management (Sign In / Sign Out). |
| **Sign In / Sign Up (`/(auth)`)** | Ultra-sleek dark theme authentication screens with 6-digit OTP verification. |

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (Expo SDK 54)
- **Routing**: [Expo Router v6](https://docs.expo.dev/router/introduction/)
- **Icons**: [@expo/vector-icons (Ionicons)](https://icons.expo.fyi/)
- **Styling**: Vanilla React Native `StyleSheet` & HSL dark tokens
- **Authentication**: Custom lightweight `AuthContext` + Clerk REST API integration

---

## 📁 Project Structure

```text
reactApp/
├── app/
│   ├── (auth)/
│   │   ├── _layout.jsx
│   │   ├── sign_in.jsx
│   │   └── sign_up.jsx
│   ├── (root)/
│   │   └── (tabs)/
│   │       ├── _layout.jsx
│   │       ├── index.jsx
│   │       ├── search.jsx
│   │       ├── saved.jsx
│   │       └── profile.jsx
│   └── _layout.jsx
├── assets/
│   └── images/
│       └── app_logo_1785056480414.png
├── context/
│   └── AuthContext.jsx
├── .env
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Expo Go App on your mobile device (iOS/Android) or an Emulator

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PremBorde/Aspect_Move.git
   cd Aspect_Move
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Clerk publishable key:
   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

4. **Start the Expo Development Server**:
   ```bash
   npx expo start
   ```

5. **Run on Device**:
   - Scan the generated QR code using **Expo Go** on Android or Camera app on iOS.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
