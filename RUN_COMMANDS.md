# 🚀 Run FitLife Tracker - Command Guide

## Quick Commands (Copy & Paste)

### Step 1: Navigate to Project
```powershell
cd d:\FitLife_Tracker
```

### Step 2: Install Dependencies
```powershell
npm install
```

**⏱️ This will take 2-5 minutes depending on your internet speed**

### Step 3: Configure API Key

**Option A: Manual Edit**
1. Open `d:\FitLife_Tracker\src\services\apiService.ts`
2. Find line 3: `const API_NINJAS_KEY = 'YOUR_API_KEY_HERE';`
3. Replace `YOUR_API_KEY_HERE` with your API key from https://api-ninjas.com/

**Option B: Using PowerShell (After getting API key)**
```powershell
# Replace YOUR_ACTUAL_API_KEY with your real key
$apiKey = "YOUR_ACTUAL_API_KEY"
$filePath = "d:\FitLife_Tracker\src\services\apiService.ts"
(Get-Content $filePath) -replace 'YOUR_API_KEY_HERE', $apiKey | Set-Content $filePath
```

### Step 4: Start the App
```powershell
npm start
```

**or**

```powershell
npx expo start
```

### Step 5: Choose Platform

Once the server starts, press:
- **`i`** - Open in iOS Simulator (Mac only)
- **`a`** - Open in Android Emulator
- **`w`** - Open in web browser
- **Scan QR** - Use Expo Go app on your phone

---

## 📱 Running on Phone

### Android
1. Install **Expo Go** from Google Play Store
2. Open Expo Go app
3. Tap "Scan QR code"
4. Scan the QR code from your terminal
5. Wait for app to load

### iOS
1. Install **Expo Go** from App Store
2. Open Camera app
3. Scan the QR code from your terminal
4. Tap the notification to open in Expo Go
5. Wait for app to load

**⚠️ Important**: Your phone and computer must be on the same Wi-Fi network!

---

## 💻 Running on Emulator/Simulator

### Android Emulator

**First Time Setup:**
1. Install Android Studio: https://developer.android.com/studio
2. Open Android Studio
3. Go to: Tools → AVD Manager
4. Click "Create Virtual Device"
5. Select a device (e.g., Pixel 5)
6. Download a system image (e.g., Android 13)
7. Click "Finish"

**Running:**
```powershell
# Start emulator from Android Studio AVD Manager
# Or use command line:
emulator -avd Pixel_5_API_33

# In another terminal:
cd d:\FitLife_Tracker
npm start
# Then press 'a'
```

### iOS Simulator (Mac Only)

**First Time Setup:**
1. Install Xcode from Mac App Store
2. Open Xcode → Preferences → Components
3. Install iOS Simulator

**Running:**
```bash
cd /path/to/FitLife_Tracker
npm start
# Then press 'i'
```

---

## 🔧 Troubleshooting Commands

### Clear Cache and Restart
```powershell
npx expo start -c
```

### Reset Everything
```powershell
# Delete node_modules and package-lock
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install

# Start fresh
npx expo start -c
```

### Check Expo Installation
```powershell
npx expo --version
```

### Check Node Version
```powershell
node --version
# Should be v14 or higher
```

### Check npm Version
```powershell
npm --version
```

### Install Expo CLI Globally (if needed)
```powershell
npm install -g expo-cli
```

### Fix Port Issues (if port 8081 is busy)
```powershell
# Find process using port 8081
netstat -ano | findstr :8081

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or start on different port
npx expo start --port 8082
```

### Connection Issues - Use Tunnel Mode
```powershell
npx expo start --tunnel
```

---

## 📦 Installing Additional Packages

```powershell
# Install a new package
npm install package-name

# Install with specific version
npm install package-name@version

# Install as dev dependency
npm install --save-dev package-name
```

---

## 🧪 Testing the App

### Test Login
1. Open the app
2. Tap "Don't have an account? Register"
3. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm: `password123`
4. Tap "Register"
5. You should be logged in automatically

### Test Exercises
1. After login, you're on Home screen
2. You should see exercises listed
3. If you see "Failed to load exercises":
   - Check your API key in `apiService.ts`
   - Verify internet connection
   - Check API Ninjas service status

### Test Favourites
1. Tap any exercise card
2. View the exercise details
3. Tap "Add to Favourites" button
4. Go to Favourites tab (bottom navigation)
5. You should see your saved exercise

### Test Profile
1. Tap Profile tab (bottom navigation)
2. View your user information
3. See favourites count
4. Tap Logout
5. Confirm logout
6. You should return to login screen

---

## 🎯 Development Commands

### Start Development Server
```powershell
npm start
```

### Start with Clear Cache
```powershell
npm start -- -c
```

### Check for Updates
```powershell
expo doctor
```

### View Project Info
```powershell
npx expo whoami
```

---

## 📝 Useful PowerShell Commands

### Navigate to Project
```powershell
cd d:\FitLife_Tracker
```

### List Files
```powershell
ls
```

### View File Content
```powershell
cat .\README.md
```

### Open in VS Code
```powershell
code .
```

### Open Folder in Explorer
```powershell
explorer .
```

---

## 🌐 URLs and Ports

### Expo DevTools (Browser)
```
http://localhost:19002
```

### Metro Bundler
```
http://localhost:8081
```

### Web Version (if running on web)
```
http://localhost:19006
```

---

## 📱 Device-Specific Commands

### View Connected Devices
```powershell
# Android
adb devices

# iOS (Mac)
xcrun simctl list devices
```

### Clear App Data on Device
```powershell
# Android
adb shell pm clear host.exp.exponent

# iOS - Delete app from simulator and reinstall
```

---

## 🔍 Debugging Commands

### View Metro Bundler Logs
```powershell
npm start
# Logs appear in terminal
```

### Open React Native Debugger
```powershell
# In the app, shake device or:
# Android: Ctrl+M
# iOS: Cmd+D
# Select "Debug Remote JS"
```

### View Console Logs
- Open browser at http://localhost:19002
- Click "Console" tab to view logs

---

## 📊 Build Commands (Future Use)

### Build for Android
```powershell
npx expo build:android
```

### Build for iOS
```powershell
npx expo build:ios
```

### Build for Web
```powershell
npx expo build:web
```

---

## 🎨 Asset Commands

### Optimize Assets
```powershell
npx expo-optimize
```

---

## 📚 Documentation Commands

### View React Native Docs
```powershell
start https://reactnative.dev/
```

### View Expo Docs
```powershell
start https://docs.expo.dev/
```

### View React Navigation Docs
```powershell
start https://reactnavigation.org/
```

---

## ⚡ Quick Reference

### Most Used Commands
```powershell
cd d:\FitLife_Tracker          # Go to project
npm install                     # Install dependencies
npm start                       # Start dev server
npx expo start -c              # Start with cache clear
code .                         # Open in VS Code
```

### Most Common Issues
```powershell
# Port busy
npx expo start --port 8082

# Connection issues
npx expo start --tunnel

# Cache issues
npx expo start -c

# Complete reset
rm -rf node_modules; npm install; npx expo start -c
```

---

## 🚀 Ready to Run?

**Copy and paste these commands:**

```powershell
# Navigate to project
cd d:\FitLife_Tracker

# Install everything
npm install

# Start the app
npm start
```

**Then press `i` for iOS or `a` for Android or scan QR code with your phone!**

---

## ✅ Checklist

Before running, make sure:
- [ ] Node.js is installed (check: `node --version`)
- [ ] npm is installed (check: `npm --version`)
- [ ] You're in the project directory (`d:\FitLife_Tracker`)
- [ ] Dependencies are installed (`npm install`)
- [ ] API key is configured (in `src/services/apiService.ts`)
- [ ] Phone/Emulator is ready
- [ ] Same Wi-Fi network (if using phone)

---

**You're all set! Happy coding! 🎉**
