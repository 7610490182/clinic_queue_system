# Smart Clinic Queue Management System

A full-stack MERN application for managing clinic appointments with real-time queue updates.

## Features

- **User Authentication**: JWT-based login/registration for patients and admins
- **Role-based Access**: Separate dashboards for patients and administrators
- **Doctor Management**: Add/edit doctors with specializations and availability
- **Appointment Booking**: Book appointments with automatic token generation
- **Real-time Queue**: Live queue updates using Socket.io
- **Payment Integration**: Razorpay payment gateway integration
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay

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

3. Create a `.env` file in the server directory:
   ```bash
   cp .env.example .env
   ```
   
   Then update `.env` with your actual values:
   ```
   MONGO_URI=mongodb://localhost:27017/clinic-queue
   JWT_SECRET=your_jwt_secret_key_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   PORT=5000
   ```

4. Start MongoDB service (if using local MongoDB)

5. Seed sample doctors (optional):
   ```bash
   npm run seed
   ```

6. Start the backend server:
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

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Verify MONGO_URI in .env is correct
- For MongoDB Atlas, ensure IP whitelist includes your machine

### Razorpay Payment Failed
- Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correct
- Use Razorpay test keys for development
- Check payment signature verification logic

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