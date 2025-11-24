# FitLife Tracker - Quick Setup Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Configure API Key
1. Get free API key from: https://api-ninjas.com/
2. Open `src/services/apiService.ts`
3. Replace `YOUR_API_KEY_HERE` with your key

### Step 3: Run the App
```powershell
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## 📱 Test the App

1. **Register**: Create a new account with any email
2. **Browse**: View exercises on Home screen
3. **Details**: Tap an exercise to see full information
4. **Favourites**: Add exercises to your favourites
5. **Profile**: View your profile and stats

## ⚡ That's It!

For detailed documentation, see [README.md](README.md) or [GETTING_STARTED.md](GETTING_STARTED.md)

---

## 🎯 Key Features Implemented

✅ User Authentication (Login/Register)
✅ Form Validation (Formik + Yup)
✅ Exercise Discovery (API Integration)
✅ Detailed Exercise Information
✅ Favourites Management
✅ Local Data Persistence (AsyncStorage)
✅ Redux State Management
✅ React Navigation (Stack + Tabs)
✅ Responsive Design
✅ TypeScript Support

## 🛠️ Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **State**: Redux Toolkit
- **Navigation**: React Navigation
- **Forms**: Formik + Yup
- **Storage**: AsyncStorage
- **API**: Axios

## 📁 Project Structure

```
src/
├── constants/       # Themes & configs
├── navigation/      # Navigation setup
├── screens/         # All screens
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── DetailsScreen.tsx
│   ├── FavouritesScreen.tsx
│   └── ProfileScreen.tsx
├── services/        # API & storage
└── store/           # Redux slices
```

## 🐛 Quick Troubleshooting

**Issue**: Module errors
```powershell
npm install
expo start -c
```

**Issue**: Can't connect to app
- Ensure phone and PC are on same Wi-Fi
- Try: `expo start --tunnel`

**Issue**: API not working
- Check API key in `src/services/apiService.ts`
- Verify internet connection

---

Happy coding! 🎉
