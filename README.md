# 🏋️ FitLife Tracker

A comprehensive cross-platform mobile application for discovering, tracking, and managing health and wellness activities. Built with React Native (Expo) for the frontend and Node.js/Express for the backend.

## � Overview

FitLife Tracker helps users:
- **Discover Exercises** - Browse 15+ exercises with detailed instructions
- **Track Progress** - Save favourite exercises and monitor your fitness journey
- **Learn & Improve** - Access 20+ wellness tips across workout, nutrition, recovery, and mindset
- **Stay Motivated** - Set goals, track stats, and build healthy habits

## 🚀 Features

### Frontend (Mobile App)
- ✅ User authentication with JWT
- ✅ Exercise browsing with filters (type, muscle, difficulty)
- ✅ Detailed exercise instructions
- ✅ Favourites management
- ✅ User profile with stats
- ✅ Wellness tips and guidance
- ✅ Clean, modern UI with animations
- ✅ Offline data persistence

### Backend (REST API)
- ✅ JWT authentication system
- ✅ User registration and login
- ✅ Exercise management with filters
- ✅ Favourites CRUD operations
- ✅ Wellness tips API
- ✅ User profile management
- ✅ Secure password hashing

## 🛠️ Tech Stack

### Frontend
- **React Native** (Expo ~50.0.0)
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Navigation** - Navigation
- **Formik + Yup** - Form handling
- **AsyncStorage** - Local storage

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

### 3️⃣ Running the App

1. **Start Backend First** (Terminal 1)
   ```powershell
   cd backend
   npm start
   ```

2. **Start Frontend** (Terminal 2)
   ```powershell
   cd frontend
   npx expo start
   ```

3. **Open on Device/Emulator**
   - Scan QR code with Expo Go (iOS/Android)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (Mac only)
   - Press `w` for web browser

## 🔐 Authentication

### Test Accounts (Pre-loaded)
- **Email:** john@example.com
- **Password:** password123

Or register a new account through the app!

## 📱 App Screens

1. **Login Screen** - Email/password authentication
2. **Register Screen** - New user registration
3. **Home Screen** - Browse exercises with filters
4. **Details Screen** - Exercise instructions & tips
5. **Favourites Screen** - Saved exercises
6. **Profile Screen** - User info, stats, settings

## 🌐 API Endpoints

### Base URL: `http://localhost:3000/api`

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

#### Exercises
- `GET /exercises` - Get all exercises (with filters)
- `GET /exercises/:id` - Get exercise by ID

#### Favourites
- `GET /favourites` - Get user favourites (protected)
- `POST /favourites` - Add favourite (protected)
- `DELETE /favourites/:name` - Remove favourite (protected)

#### Tips
- `GET /tips` - Get all tips
- `GET /tips/:id` - Get tip by ID

#### Users
- `GET /users/profile` - Get profile (protected)
- `PUT /users/profile` - Update profile (protected)

See `backend/README.md` for detailed API documentation.

## 🎨 Features Walkthrough

### Exercise Discovery
- Browse 15+ exercises
- Filter by type (strength, cardio)
- Filter by muscle group
- Filter by difficulty level
- View detailed instructions

### Favourites Management
- Save exercises to favourites
- View all saved exercises
- Remove from favourites
- Sync across sessions

### Wellness Tips
- 20+ health and fitness tips
- Categories: Workout, Nutrition, Recovery, Mindset
- Easy-to-follow guidance
- Icon-based categorization

### User Profile
- View personal information
- Track workout statistics
- Update profile details
- Logout functionality

## 📚 Documentation

Comprehensive documentation available in the `docs/` directory:

1. **Project_Setup.md** - Complete setup guide
2. **Architecture.md** - System architecture
3. **API_Documentation.md** - Full API reference
4. **Component_Structure.md** - Frontend components
5. **State_Management.md** - Redux patterns
6. **Navigation_Flow.md** - App navigation
7. **Authentication_Guide.md** - Auth implementation
8. **Styling_Guide.md** - UI/UX guidelines
9. **Testing_Guide.md** - Testing strategies
10. **Deployment_Guide.md** - Production deployment
11. **Troubleshooting.md** - Common issues & solutions

## 🧪 Testing

### Backend Testing
```powershell
cd backend

# Test registration
$body = @{email="test@example.com"; password="test123"; firstName="Test"; lastName="User"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $body -ContentType "application/json"

# Test exercises
Invoke-RestMethod -Uri "http://localhost:3000/api/exercises" -Method Get
```

### Frontend Testing
- Use Expo Go app for manual testing
- Test on both iOS and Android devices
- Test authentication flow
- Test all CRUD operations

## 🚢 Deployment

### Backend Deployment
- Deploy to Heroku, Railway, or Render
- Set environment variables
- Use production database (MongoDB/PostgreSQL)
- Enable HTTPS

### Frontend Deployment
- Build with Expo EAS
- Submit to App Store / Play Store
- Update API URLs to production backend
- Configure app.json for production

See `docs/Deployment_Guide.md` for detailed instructions.

## 🐛 Troubleshooting

### Backend Issues
- **Port in use:** Change PORT in `.env`
- **JWT errors:** Verify JWT_SECRET is set
- **CORS errors:** Check CORS configuration

### Frontend Issues
- **Can't connect to backend:** Update BASE_URL in apiService.ts
- **Expo errors:** Clear cache with `npx expo start -c`
- **Dependencies issues:** Delete node_modules and reinstall

See `docs/Troubleshooting.md` for more solutions.

## 🔮 Future Enhancements

### Planned Features
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Workout plan creator
- [ ] Progress tracking with charts
- [ ] Social features (friends, sharing)
- [ ] Exercise videos and images
- [ ] Custom exercise creation
- [ ] Wearable device integration
- [ ] Push notifications
- [ ] Dark mode
- [ ] Offline mode improvements

### Backend Enhancements
- [ ] Refresh token implementation
- [ ] Email verification
- [ ] Password reset
- [ ] Rate limiting
- [ ] API versioning
- [ ] Admin panel
- [ ] Analytics dashboard

### Frontend Enhancements
- [ ] Onboarding flow
- [ ] Achievement system
- [ ] Calendar view
- [ ] Exercise timer
- [ ] Rest timer between sets
- [ ] Workout history
- [ ] Progress photos

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team & Support

- **Developer:** FitLife Team
- **Support:** GitHub Issues
- **Documentation:** `/docs` directory

## 🙏 Acknowledgments

- Exercise data inspired by fitness communities
- UI design inspired by modern fitness apps
- Icons from React Native Vector Icons
- Built with ❤️ for fitness enthusiasts

---

**Happy Coding & Stay Fit! 💪**

For detailed setup and usage instructions, see the README files in each directory:
- Frontend: `frontend/README.md`
- Backend: `backend/README.md`
# Open a new terminal
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Update API URL in src/services/apiService.ts
# Change BASE_URL to your backend URL (http://localhost:3000/api)

# Start Expo development server
npx expo start
```
   
   Get your free API key at: https://api-ninjas.com/

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## 📱 App Structure

```
FitLife_Tracker/
├── src/
│   ├── constants/
│   │   └── theme.ts                 # Theme configuration
│   ├── navigation/
│   │   ├── AuthNavigator.tsx        # Auth stack navigation
│   │   └── MainNavigator.tsx        # Main app navigation
│   ├── screens/
│   │   ├── LoginScreen.tsx          # Login screen
│   │   ├── RegisterScreen.tsx       # Registration screen
│   │   ├── HomeScreen.tsx           # Exercise listing
│   │   ├── DetailsScreen.tsx        # Exercise details
│   │   ├── FavouritesScreen.tsx     # Saved exercises
│   │   └── ProfileScreen.tsx        # User profile
│   ├── services/
│   │   ├── apiService.ts            # API integration
│   │   └── storageService.ts        # Local storage
│   └── store/
│       ├── slices/
│       │   ├── authSlice.ts         # Auth state
│       │   ├── exercisesSlice.ts    # Exercises state
│       │   └── favouritesSlice.ts   # Favourites state
│       ├── hooks.ts                 # Redux hooks
│       └── index.ts                 # Store configuration
├── App.tsx                          # Root component
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript config
```

## 🎨 Features Breakdown

### Authentication Flow
- Login with email/password validation
- Registration with comprehensive form validation
- Secure token storage with AsyncStorage
- Persistent login state across app restarts

### Home Screen
- Fetches exercises from API Ninjas
- Displays exercise cards with:
  - Exercise name and type
  - Muscle group badges
  - Difficulty level indicators
- Navigation to detailed view

### Details Screen
- Complete exercise information
- Muscle group, equipment, and difficulty
- Step-by-step instructions
- Helpful workout tips
- Add/remove from favourites

### Favourites Screen
- List of all saved exercises
- Persistent storage with AsyncStorage
- Quick access to favourite exercises
- Empty state with call-to-action

### Profile Screen
- User information display
- Statistics (favourites count)
- Account settings menu
- Logout functionality

## 🔐 Security Features

- Secure authentication token storage
- Form validation on all inputs
- Password confirmation on registration
- Secure logout with data cleanup

## 🎯 Best Practices Implemented

- **Modular Architecture**: Feature-based file organization
- **Type Safety**: Full TypeScript implementation
- **State Management**: Centralized Redux store
- **Code Reusability**: Shared components and utilities
- **Error Handling**: Comprehensive error management
- **Loading States**: User-friendly loading indicators
- **Responsive Design**: Adapts to different screen sizes

## 📝 API Integration

The app uses the following APIs:

1. **API Ninjas Fitness API**
   - Endpoint: `https://api.api-ninjas.com/v1/exercises`
   - Used for fetching exercise data
   - Requires API key (free tier available)

2. **Dummy Authentication**
   - Mock authentication service
   - Simulates login/register functionality
   - Can be replaced with real backend API

## 🚀 Future Enhancements

- Dark mode implementation
- Workout tracking and history
- Progress charts and statistics
- Custom workout creation
- Social sharing features
- Push notifications
- Offline mode support
- More exercise filters and search

## 🐛 Troubleshooting

### Common Issues

1. **Module not found errors**
   ```bash
   npm install
   expo start -c
   ```

2. **API not working**
   - Verify API key is correct
   - Check internet connection
   - Ensure API Ninjas service is available

3. **Storage issues**
   - Clear app data
   - Restart Expo development server

## 📄 License

This project is created for educational purposes.

## 👥 Contributing

This is a learning project. Feel free to fork and modify for your own use.

## 📞 Support

For issues and questions, please refer to the React Native and Expo documentation:
- React Native: https://reactnative.dev/
- Expo: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/

---

Built with ❤️ using React Native and Expo
