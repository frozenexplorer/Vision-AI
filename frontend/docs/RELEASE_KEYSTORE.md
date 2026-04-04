# Release Keystore (Production)

For signing production APKs, you need a release keystore. This is separate from the debug keystore.

## 1. Generate the release keystore

From `frontend/`:

```bash
node scripts/generate-release-keystore.js
```

This creates `android/app/release.keystore` (gitignored).

**Optional:** Use a custom password via env vars:

```bash
KEYSTORE_PASSWORD=your-secret node scripts/generate-release-keystore.js
```

## 2. Add to local.properties

Run the prebuild script (it will add release config if the keystore exists):

```bash
npm run prebuild
```

Or manually add to `android/local.properties`:

```
release.keystore.file=D:/VS/VisionAI/frontend/android/app/release.keystore
release.keystore.password=visionai-release
release.keystore.alias=visionai-release
release.keystore.keyPassword=visionai-release
```

## 3. Add SHA-256 to Firebase App Check

After generating, the script prints the SHA-256 fingerprint. Add it to Firebase Console:

- **Build** → **App Check** → your production Android app (`com.anonymous.VisionAI`)
- **Add fingerprint** → paste the SHA-256

## 4. Build release APK

```bash
npm run android:apk
```

Output: `android/app/build/outputs/apk/dev/release/app-dev-release.apk`

## 5. Backup

**Keep the keystore and passwords safe.** You need them for:

- All future app updates on Play Store
- Google Sign-In (production SHA-1/SHA-256 in Firebase)

Store a backup in a secure location (e.g. encrypted cloud storage).
