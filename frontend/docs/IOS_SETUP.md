# iOS Setup for VisionAI

The `ios/` folder is pre-configured and committed to the repo. You can build and run on iOS once you have access to a Mac with Xcode.

## Prerequisites (on Mac)

- **macOS** (required for iOS development)
- **Xcode** (latest from App Store)
- **CocoaPods**: `sudo gem install cocoapods`
- **Node.js** v18+

## One-time setup (when you have a Mac)

### 1. Install CocoaPods dependencies

```bash
cd frontend/ios
pod install
```

### 2. Add Firebase config (required for Auth & Crashlytics)

1. In [Firebase Console](https://console.firebase.google.com/), add an **iOS app** to your project.
2. Use bundle ID: `com.anonymous.VisionAI`
3. Download `GoogleService-Info.plist`
4. Place it in `frontend/ios/VisionAITemp/` (next to Info.plist)

### 3. Run the app

From repo root:

```bash
npm run ios
```

Or from `frontend/`:

```bash
npx react-native run-ios
```

## Current configuration

- **Bundle ID**: `com.anonymous.VisionAI`
- **Display name**: VisionAI
- **Permissions**: Camera, Microphone (in Info.plist)
- **Target**: VisionAITemp (Xcode project name; app displays as VisionAI)

## Without a Mac

- The `ios/` folder is set up and ready to commit.
- You can edit JS/TS code and the shared app logic on Windows.
- When you get a Mac, run `pod install` in `frontend/ios`, add `GoogleService-Info.plist`, and build.

## Troubleshooting

- **Pod install fails**: Run `cd ios && pod install --repo-update`
- **Build errors**: Ensure Xcode Command Line Tools: `xcode-select --install`
- **Simulator not found**: Open Xcode once to accept license and install simulators
