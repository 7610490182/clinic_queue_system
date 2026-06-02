# Smart Clinic Queue Management System

A full-stack MERN application for managing clinic appointments with real-time queue updates.

## ✨ Latest Updates & Bug Fixes

### Recently Fixed ✅
- **MongoDB Connection**: Fixed SSL/TLS connection issues with retry logic
- **Authentication Security**: Enhanced middleware with proper error handling
- **Input Validation**: Added comprehensive validation for all user inputs
- **Appointment Cancellation**: New feature to cancel appointments
- **Payment Security**: Added user authorization checks for payment endpoints
- **Error Logging**: Better error messages for debugging
- **Socket.io URLs**: Fixed hardcoded URLs to use environment variables

See [BUG_FIXES.md](BUG_FIXES.md) for detailed information on all fixes.
See [ENHANCEMENTS.md](ENHANCEMENTS.md) for planned feature implementations.

## Features

- ✅ **User Authentication**: JWT-based login/registration for patients, doctors, and admins
- ✅ **Role-based Access**: Separate dashboards for different user roles
- ✅ **Doctor Management**: Add/edit/delete doctors with specializations and availability
- ✅ **Appointment Booking**: Book with automatic token generation and validation
- ✅ **Appointment Cancellation**: Patients can cancel their appointments
- ✅ **Real-time Queue**: Live queue updates using Socket.io
- ✅ **Payment Integration**: Razorpay payment gateway (with mock mode for development)
- ✅ **Input Validation**: Comprehensive validation on all inputs
- ✅ **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- ✅ **Dark Mode**: Toggle between light and dark themes

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Socket.io-client, Vite
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay
- **Encryption**: bcryptjs for password hashing

## Project Structure

```
clinic-queue-system/
├── server/                 # Backend Node.js application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   ├── server.js          # Main server file
│   └── package.json
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context for auth
│   │   ├── pages/         # Page components
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Razorpay account for payment integration

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```
   MONGO_URI=mongodb://localhost:27017/clinic-queue
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```

4. **Setup MongoDB**:
   
   **Option A - Local MongoDB** (Recommended for development):
   ```bash
   # Windows: Install from https://www.mongodb.com/try/download/community
   # macOS: brew install mongodb-community && brew services start mongodb-community
   # Linux: sudo apt-get install mongodb && sudo systemctl start mongodb
   ```
   
   **Option B - MongoDB Atlas** (Cloud):
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create a cluster and get connection string
   - Update MONGO_URI in .env
   - Whitelist your IP address
   
   See [LOCAL_SETUP.md](LOCAL_SETUP.md) for detailed instructions.

5. Seed sample data (optional):
   ```bash
   npm run seed
   ```

6. Start the backend:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Add new doctor (Admin only)
- `PUT /api/doctors/:id` - Update doctor (Admin only)
- `DELETE /api/doctors/:id` - Delete doctor (Admin only)

### Appointments
- `GET /api/appointments/my` - Get user's appointments
- `GET /api/appointments` - Get all appointments (Admin only)
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/:id/status` - Update appointment status (Admin only)
- `GET /api/appointments/queue/:doctorId/:date` - Get queue for doctor on date

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

## Sample Data

### Create Admin User
Register with role: 'admin' to create an admin account.

### Sample Doctors
Use the admin dashboard to add doctors with the following sample data:

```json
{
  "name": "Dr. John Smith",
  "specialization": "Cardiology",
  "email": "john.smith@clinic.com",
  "phone": "+1234567890",
  "experience": 10,
  "timings": {
    "start": "09:00",
    "end": "17:00"
  },
  "availableDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
}
```

## Usage

1. **Patient Registration/Login**: Patients can register and login to access the system
2. **View Doctors**: Browse available doctors with their specializations and timings
3. **Search Doctors**: Search by symptom/problem or filter by specialization
4. **Book Appointments**: Select doctor, date, and time to book appointments
5. **Payment**: Complete payment through Razorpay integration
6. **Track Appointments**: View appointment status and token numbers with real-time updates
7. **Real-time Queue**: See live queue position and current token being served
8. **Admin Dashboard**: 
   - Manage doctors (add/edit/delete)
   - View all appointments
   - Control queue (call next, mark ongoing, complete)
   - Track stats (daily patients, earnings, completed appointments)

## Test Accounts

### Patient Account
- **Email**: patient@test.com
- **Password**: Test123!
- **Role**: Patient

### Doctor/Admin Account
- **Email**: doctor@test.com
- **Password**: Test123!
- **Role**: Admin/Doctor

Or register new accounts directly through the UI.

## Troubleshooting

### "Cannot GET /api/..." - 404 Errors
- ✅ Ensure backend server is running on port 5000
- ✅ Check that MONGO_URI is correct and MongoDB is connected
- ✅ Verify Vite proxy configuration in `client/vite.config.js`
- ✅ Check that both backend and frontend are running

### MongoDB Connection Errors
- ✅ Error "ECONNREFUSED": MongoDB not running. Start it: `mongod` or `brew services start mongodb-community`
- ✅ Error "SSL/TLS": Check MongoDB Atlas IP whitelist or use local MongoDB
- ✅ Error "Authentication failed": Verify credentials in MONGO_URI

### Authentication Issues
- ✅ "Invalid credentials": Check that seeded data exists or manually create account
- ✅ "Token not found": Check localStorage for 'token' - may need to login again
- ✅ "401 Unauthorized": Token expired or invalid - login again

### Socket.io Not Connecting
- ✅ Check browser console for connection errors
- ✅ Verify VITE_SOCKET_URL in `.env`
- ✅ Ensure backend Socket.io is running and CORS is configured
- ✅ Check that client port (5173) matches CLIENT_URL in backend

### Payment Issues
- ✅ Razorpay error in development: Use test keys, not live keys
- ✅ "Mock mode" message: Normal for development with dummy keys
- ✅ Payment page blank: Check browser console for Razorpay script loading errors

### Build/Compile Errors
- ✅ "Cannot find module": Run `npm install` in both server and client directories
- ✅ "Port already in use": Change PORT in .env or kill existing process
- ✅ Clear node_modules: `rm -rf node_modules` and `npm install` (or use PowerShell on Windows)

## Documentation

- [BUG_FIXES.md](BUG_FIXES.md) - Detailed list of all bugs fixed
- [ENHANCEMENTS.md](ENHANCEMENTS.md) - Guide for implementing remaining features
- [LOCAL_SETUP.md](LOCAL_SETUP.md) - Detailed local development setup
- [FEATURE_VERIFICATION.md](FEATURE_VERIFICATION.md) - Feature completeness report

## Real-time Features

- Live queue position updates
- Real-time appointment status changes
- Instant notifications for queue movements

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Secure payment verification

## Deployment

### Backend Deployment
- Use services like Heroku, Railway, or Vercel for backend deployment
- Ensure environment variables are set in production
- Use MongoDB Atlas for cloud database

### Frontend Deployment
- Build the project: `npm run build`
- Deploy to Netlify, Vercel, or any static hosting service
- Update API base URL for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.