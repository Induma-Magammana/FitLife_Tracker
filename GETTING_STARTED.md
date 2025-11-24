# Getting Started with FitLife Tracker

This guide will help you set up and run the FitLife Tracker app on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **npm** (comes with Node.js) or **yarn**
  - Verify npm: `npm --version`
  - Or install yarn: `npm install -g yarn`

- **Expo CLI**
  - Install globally: `npm install -g expo-cli`
  - Verify: `expo --version`

- **Mobile Device** with Expo Go app installed
  - iOS: https://apps.apple.com/app/expo-go/id982107779
  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

OR

- **Emulator/Simulator**
  - iOS: Xcode (Mac only)
  - Android: Android Studio

## Step-by-Step Setup

### 1. Navigate to Project Directory

```powershell
cd d:\FitLife_Tracker
```

### 2. Install Dependencies

```powershell
npm install
```

This will install all required packages including:
- React Native and Expo
- React Navigation
- Redux Toolkit
- Formik & Yup
- AsyncStorage
- Axios

### 3. Configure API Key

1. Sign up for a free API key at https://api-ninjas.com/
2. Open `src/services/apiService.ts`
3. Replace `YOUR_API_KEY_HERE` with your actual API key:

```typescript
const API_NINJAS_KEY = 'your_actual_api_key_from_api_ninjas';
```

### 4. Start the Development Server

```powershell
npm start
```

Or with Expo:
```powershell
expo start
```

### 5. Run the App

After starting the development server, you'll see a QR code in your terminal.

**Option A: Run on Physical Device**
1. Open Expo Go app on your phone
2. Scan the QR code
3. Wait for the app to load

**Option B: Run on iOS Simulator (Mac only)**
1. Press `i` in the terminal
2. Or click "Run on iOS simulator" in the browser

**Option C: Run on Android Emulator**
1. Start Android emulator first
2. Press `a` in the terminal
3. Or click "Run on Android device/emulator" in the browser

## Default Login Credentials

The app uses a dummy authentication system. You can:

1. **Register a new account**
   - Enter any valid email format
   - Password must be at least 6 characters

2. **Login**
   - Use the email and password you registered with
   - Authentication data is stored locally

## Project Structure Overview

```
FitLife_Tracker/
├── src/
│   ├── constants/       # Theme and configuration
│   ├── navigation/      # Navigation setup
│   ├── screens/         # All app screens
│   ├── services/        # API and storage services
│   └── store/           # Redux store and slices
├── App.tsx              # Root component
├── package.json         # Dependencies
└── README.md            # Documentation
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser

## Common Commands

### Clear Cache and Restart
```powershell
expo start -c
```

### Install a New Package
```powershell
npm install package-name
```

### Check for Issues
```powershell
expo doctor
```

## Troubleshooting

### Issue: "Unable to resolve module"
**Solution:**
```powershell
rm -rf node_modules
npm install
expo start -c
```

### Issue: "Network response timed out"
**Solution:**
- Check your internet connection
- Ensure phone and computer are on same Wi-Fi network
- Try using tunnel mode: `expo start --tunnel`

### Issue: "API key invalid"
**Solution:**
- Verify your API key is correct
- Check if API key is properly set in `apiService.ts`
- Ensure no extra spaces in the API key string

### Issue: "Metro bundler not working"
**Solution:**
```powershell
# Kill any processes on port 8081
# Windows:
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Then restart
expo start -c
```

## Development Tips

1. **Hot Reloading**: Changes to your code will automatically reload the app

2. **Debug Menu**: 
   - iOS: Cmd + D
   - Android: Cmd/Ctrl + M

3. **View Console Logs**:
   - Open browser at `http://localhost:19002`
   - Click on "Console" tab

4. **Test Different Features**:
   - Start by registering a new account
   - Browse exercises on Home screen
   - Tap any exercise to view details
   - Add exercises to favourites
   - Check Profile to see your information

## Next Steps

After successfully running the app:

1. Explore the codebase in `src/` directory
2. Try modifying the theme in `src/constants/theme.ts`
3. Add new features or customize existing ones
4. Read the main README.md for detailed documentation

## Need Help?

- React Native Docs: https://reactnative.dev/docs/getting-started
- Expo Docs: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/docs/getting-started
- Redux Toolkit: https://redux-toolkit.js.org/

Happy coding! 🚀
