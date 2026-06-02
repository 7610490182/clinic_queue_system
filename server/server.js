const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const paymentRoutes = require('./routes/payments');
const userRoutes = require('./routes/users');

const app = express();
const server = http.createServer(app);
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
const io = socketIo(server, {
  cors: {
    origin: clientOrigin,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({ origin: clientOrigin }));
app.use(express.json());

// Connect to MongoDB with retry logic and optional fallback URI
const connectDB = async (retries = 5) => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = process.env.FALLBACK_MONGO_URI;
  const uri = primaryUri || fallbackUri;

  if (!uri) {
    console.error('No MongoDB URI provided in environment variables');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB at ${uri}`);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error(`MongoDB connection failed (attempt ${6 - retries}/5):`, err.message);
    if (retries > 1) {
      console.log(`Retrying in 5 seconds... (${retries - 1} attempts remaining)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else if (uri !== fallbackUri && fallbackUri) {
      console.warn('Primary MongoDB failed, trying fallback URI...');
      process.env.MONGO_URI = fallbackUri;
      connectDB(5);
    } else {
      console.error('Failed to connect to MongoDB after all retries');
      console.log('Please check:');
      console.log('1. MongoDB URI in .env file');
      console.log('2. Network connectivity');
      console.log('3. IP whitelist in MongoDB Atlas if using Atlas');
      process.exit(1);
    }
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible in routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});