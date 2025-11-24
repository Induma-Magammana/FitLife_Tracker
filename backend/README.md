# FitLife Tracker - Backend API

Node.js/Express REST API for the FitLife Tracker mobile application.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 🏋️ **Exercise Management** - Browse and filter 15+ exercises
- ⭐ **Favourites System** - Save and manage favourite exercises
- 💡 **Wellness Tips** - 20+ health and fitness tips
- 👤 **User Profiles** - Manage user information

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## Project Structure

```
backend/
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── exerciseController.js
│   ├── favouriteController.js
│   ├── tipsController.js
│   └── userController.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── exerciseRoutes.js
│   ├── favouriteRoutes.js
│   ├── tipsRoutes.js
│   └── userRoutes.js
├── middleware/         # Custom middleware
│   └── authMiddleware.js
├── data/              # JSON data files
│   ├── exercises.json
│   ├── tips.json
│   └── users.json
├── app.js            # Express app configuration
├── server.js         # Server entry point
├── package.json      # Dependencies
└── .env             # Environment variables
```

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   JWT_SECRET=your-secret-key-here-change-in-production
   NODE_ENV=development
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/auth/verify` | Verify JWT token | Yes |

**Register/Login Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Exercise Routes (`/api/exercises`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/exercises` | Get all exercises (with filters) | No |
| GET | `/api/exercises/:id` | Get exercise by ID | No |
| GET | `/api/exercises/filters/all` | Get available filters | No |

**Query Parameters for GET `/api/exercises`:**
- `type` - Filter by type (strength, cardio, etc.)
- `muscle` - Filter by muscle group
- `difficulty` - Filter by difficulty level

**Example:** `/api/exercises?type=strength&difficulty=beginner`

### Favourites Routes (`/api/favourites`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/favourites` | Get user's favourites | Yes |
| POST | `/api/favourites` | Add exercise to favourites | Yes |
| DELETE | `/api/favourites/:exerciseName` | Remove from favourites | Yes |

**Add Favourite Request Body:**
```json
{
  "exerciseName": "Push-ups"
}
```

### Tips Routes (`/api/tips`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tips` | Get all tips (with category filter) | No |
| GET | `/api/tips/:id` | Get tip by ID | No |
| GET | `/api/tips/categories/all` | Get available categories | No |

**Query Parameters:**
- `category` - Filter by category (workout, nutrition, recovery, mindset)

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Expiration
- Access tokens expire after **24 hours**
- Refresh/re-login required after expiration

## Data Storage

Currently using JSON files for data storage:
- `users.json` - User accounts (passwords hashed with bcrypt)
- `exercises.json` - 15 pre-loaded exercises
- `tips.json` - 20 wellness tips

**Note:** Favourites are stored in-memory and reset on server restart. For production, consider using a database (MongoDB, PostgreSQL, etc.).

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication
- ✅ Protected routes with middleware
- ✅ CORS enabled for cross-origin requests
- ✅ Environment variables for secrets

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `JWT_SECRET` | Secret key for JWT | (required) |
| `NODE_ENV` | Environment mode | development |

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"Test","lastName":"User"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Get Exercises:**
```bash
curl http://localhost:3000/api/exercises
```

**Get Favourites (Protected):**
```bash
curl http://localhost:3000/api/favourites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables for `baseUrl` and `token`
3. Use the Authentication tab to set Bearer token for protected routes

## Development

### Adding New Endpoints

1. Create controller function in appropriate controller file
2. Add route in corresponding route file
3. Mount route in `app.js` if new route group
4. Add authentication middleware if route should be protected

### Example:
```javascript
// controller
exports.newEndpoint = (req, res) => {
  // logic here
};

// route
router.get('/new', authMiddleware, newEndpoint);
```

## Production Deployment

### Considerations:
1. Change `JWT_SECRET` to a strong random string
2. Set `NODE_ENV=production`
3. Use a proper database instead of JSON files
4. Implement rate limiting
5. Add request validation
6. Set up logging (Winston, Morgan)
7. Use HTTPS
8. Implement refresh tokens
9. Add API versioning
10. Set up monitoring (PM2, New Relic)

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Workout plan management
- [ ] Progress tracking and analytics
- [ ] Social features (friend system)
- [ ] Exercise video/image uploads
- [ ] Admin panel
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Refresh token implementation
- [ ] Rate limiting
- [ ] API documentation with Swagger

## Troubleshooting

### Port Already in Use
```bash
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS Errors
- Ensure CORS is configured in `app.js`
- Check frontend API URL matches backend URL

### JWT Token Issues
- Verify token is being sent in Authorization header
- Check token hasn't expired
- Ensure JWT_SECRET matches between signing and verification

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub or contact the development team.
