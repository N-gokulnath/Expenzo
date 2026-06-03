# Expenzo 🎯
Expenzo is a premium, minimalist, offline-first personal finance tracking application designed to simplify money management. Built with React Native and styled with a dark emerald theme, Expenzo maps account balances, budgets, and savings targets into an intuitive visual dashboard.
This repository contains both the mobile application source code and the interactive landing page.
---
## 📁 Repository Structure
The project is structured into two main subdirectories:
*   **[`App-code/`](./App-code)**: The core mobile application source code built with React Native.
*   **[`landing/`](./landing)**: A responsive, static landing page designed to showcase Expenzo's features, screenshots, and provide a direct download link for the Android APK.
---
## 📱 Mobile App Features
### 1. Unified Dashboard
*   **Net Worth Overview**: Consolidates balances across cash, cards, and bank accounts.
*   **SVG Charts**: Dynamic spending breakdowns and weekly activity bar graphs.
*   **Smart Toggles**: Settings toggle to show/hide analytics visualizations on the main screen.
### 2. Savings Motivator
*   **Visual Targets**: Set savings goals with custom emojis, target dates, and progress bars.
*   **Urgency Coding**: Progress bars automatically adapt colors:
    *   🟢 **Green**: On Track (>= 80% saved)
    *   🔵 **Blue**: Mid-Progress (40% - 80% saved)
    *   🟠 **Amber**: Urgent / Behind (< 30% saved with < 15 days remaining)
*   **Granular Logic**: Single-tap to log account contributions; long-press to edit or delete goals.
### 3. Category Budgets
*   **Circular Progress**: Budget overview with visual caps indicating remaining surplus.
*   **Limits & Alerts**: Receive warning notifications when approaching category-specific thresholds.
### 4. Rich Analytics
*   **Donut Visuals**: High-fidelity category shares with collapsible summaries.
*   **Trend Tracking**: Date range filtering (weekly, monthly, yearly, custom) for debits and credits.
*   **Export Report**: Simulated PDF generator to download transaction histories.
### 5. Privacy & Offline Core
*   **Local Storage**: Offline-first storage utilizing Zustand state management and AsyncStorage.
*   **Zero Latency**: Zero cloud calls, keeping personal finances 100% private.
---
## 🌐 Interactive Landing Page
The `landing/` directory holds a responsive single-page web app built with Vanilla CSS variables and ES6 JS, hostable directly on **GitHub Pages**.
*   **Responsive Mockup Frame**: Displays a custom CSS mobile mockup containing the screenshots.
*   **Theme Syncing**: Switch between Light/Dark mode to transition both the landing page styling and swap all displayed mockups (`light/` vs. `dark/` screenshots).
*   **Compact Showcase (Mobile)**: Auto-collapses vertical tabs into a horizontal scroll-snap swipe bar on mobile screens.
*   **3D Parallax visual**: Mockup phone rotates in 3D perspective following mouse movements.
*   **Direct Download Button**: Link pointing to the official compiled release:
    <a href="https://github.com/N-gokulnath/Expenzo/releases/download/App/Expenzo.apk">Download Expenzo</a>
---
## 🛠️ Tech Stack
### Mobile Application
*   **Core**: React Native (Expo configuration ready), TypeScript
*   **State Management**: Zustand
*   **Storage**: `@react-native-async-storage/async-storage`
*   **Visuals**: `react-native-svg` for charts, `lucide-react-native` for icons
### Landing Page
*   **Languages**: HTML5, CSS3, ES6 JavaScript
*   **Styling**: Vanilla CSS variables, Glassmorphism, and custom Grid/Flex structures
*   **Typography**: Google Fonts (Outfit, Inter)
---
## 🚀 Getting Started
### Running the Mobile App Locally
1.  Navigate to the app directory:
    ```bash
    cd App-code
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Metro bundler:
    ```bash
    npm start
    ```
4.  Run on Android or iOS:
    ```bash
    npm run android   # For Android emulator/device
    npm run ios       # For iOS simulator/device
    ```
### Previewing the Landing Page Locally
Simply open the static index file in your browser:
```bash
# Double-click landing/index.html or run via local server
npx http-server landing/
📦 Releases
Download the official compiled Android APK directly from the release endpoint: 👉 Download Expenzo.apk

📝 License
Locally saved, privacy protected. Designed & developed by Gokul Nath.
