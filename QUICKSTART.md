# 🚀 Quick Start Guide - FitLife Tracker

Get your FitLife Tracker app running in 5 minutes!

## ⚡ Quick Setup (Windows PowerShell)

### Step 1: Backend Setup (Terminal 1)

```powershell
# Navigate to backend directory
cd d:\FitLife_Tracker\backend

# Install dependencies
npm install

# Start the backend server
npm start
```

✅ **Backend should now be running on http://localhost:3000**

### Step 2: Frontend Setup (Terminal 2 - New Window)

```powershell
# Navigate to frontend directory
cd d:\FitLife_Tracker\frontend

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

✅ **Expo Dev Tools should open in your browser**

### Step 3: Run the App

Choose one option:

**Option A: Physical Device (Recommended)**
1. Install "Expo Go" app from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in terminal/browser
3. App will load on your device!

**Option B: Emulator**
- Press `a` in terminal for Android Emulator
- Press `i` in terminal for iOS Simulator (Mac only)

**Option C: Web Browser**
- Press `w` in terminal to open in browser

## 🔐 Test Login

Use these pre-loaded test credentials:
- **Email:** john@example.com
- **Password:** password123

Or create a new account by tapping "Create Account" on the login screen!

## 📱 What You Can Do

1. **Browse Exercises** - 15 pre-loaded exercises with detailed instructions
2. **Filter & Search** - Filter by type, muscle group, difficulty
3. **Save Favourites** - Tap the heart icon to save exercises
4. **View Tips** - 20+ wellness tips in various categories
5. **Profile** - View your stats and manage settings

## 🛠️ Troubleshooting

### "Can't connect to server"
- Make sure backend is running on http://localhost:3000
- Check that you started backend first (Step 1)
- Try restarting both servers

### "Metro bundler error"
```powershell
# Clear Expo cache
npx expo start -c
```

### "Port 3000 already in use"
```powershell
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Dependencies issues
```powershell
# Backend
cd backend
Remove-Item node_modules -Recurse -Force
npm install

# Frontend
cd frontend
Remove-Item node_modules -Recurse -Force
npm install
```

## 📂 Project Structure

```
FitLife_Tracker/
├── backend/          ← Node.js REST API (Start this first!)
│   ├── data/        ← JSON data files
│   ├── controllers/ ← Business logic
│   ├── routes/      ← API endpoints
│   └── server.js    ← Entry point
│
└── frontend/        ← React Native app
    ├── src/
    │   ├── screens/ ← UI screens (6 total)
    │   ├── store/   ← Redux state
    │   └── services/← API calls
    └── App.tsx      ← Root component
```

## 🌐 API Endpoints (Backend)

Base URL: `http://localhost:3000/api`

- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `GET /exercises` - Get all exercises
- `GET /tips` - Get wellness tips
- `GET /favourites` - Get saved exercises (requires auth)

Full API docs: `backend/README.md`

## 📚 Next Steps

1. **Read the Documentation**
   - Main README: `README.md`
   - Backend API: `backend/README.md`
   - Frontend Details: `frontend/README.md`

2. **Explore the App**
   - Try all 6 screens
   - Test authentication
   - Save some favourites
   - Read wellness tips

3. **Customize**
   - Add more exercises to `backend/data/exercises.json`
   - Add more tips to `backend/data/tips.json`
   - Modify colors in frontend components
   - Add new features!

## 💡 Pro Tips

- **Keep both terminals open** - One for backend, one for frontend
- **Backend must run first** - Frontend needs API to work
- **Use Expo Go on phone** - Best experience for testing
- **Check the console** - Helpful debug info appears there
- **Hot reload works** - Changes appear automatically

## 🎯 Common Tasks

### Adding a New Exercise
Edit `backend/data/exercises.json` and add:
```json
{
  "id": "16",
  "name": "Your Exercise",
  "type": "strength",
  "muscle": "chest",
  "equipment": "dumbbell",
  "difficulty": "beginner",
  "instructions": "Step by step instructions here..."
}
```

### Changing the Port
Edit `backend/.env`:
```
PORT=3001
```
Then update `frontend/src/services/apiService.ts`:
```typescript
const BASE_URL = 'http://localhost:3001/api';
```

### Creating a New User
In the app:
1. Tap "Create Account" on login screen
2. Fill in all fields
3. Tap "Register"
4. Auto-login after successful registration

## 🆘 Need Help?

- Check `docs/Troubleshooting.md` for common issues
- Read the full documentation in `README.md`
- Review backend API docs in `backend/README.md`
- Check frontend structure in `frontend/README.md`

## ✅ Success Checklist

- [ ] Backend running on http://localhost:3000
- [ ] Frontend Expo dev server running
- [ ] App opened in Expo Go or emulator
- [ ] Logged in successfully
- [ ] Can view exercises
- [ ] Can save favourites
- [ ] Can view profile

---

**You're all set! Happy coding! 🎉**

Need more details? Check the main `README.md` or individual READMEs in `frontend/` and `backend/` directories.
