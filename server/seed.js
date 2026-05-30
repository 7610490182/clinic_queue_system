const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const User = require('./models/User');
require('dotenv').config();

const sampleDoctors = [
  {
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    email: 'sarah.johnson@clinic.com',
    phone: '+1234567890',
    experience: 12,
    timings: {
      start: '09:00',
      end: '17:00'
    },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  {
    name: 'Dr. Michael Chen',
    specialization: 'Dermatology',
    email: 'michael.chen@clinic.com',
    phone: '+1234567891',
    experience: 8,
    timings: {
      start: '10:00',
      end: '18:00'
    },
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday']
  },
  {
    name: 'Dr. Emily Davis',
    specialization: 'Pediatrics',
    email: 'emily.davis@clinic.com',
    phone: '+1234567892',
    experience: 15,
    timings: {
      start: '08:00',
      end: '16:00'
    },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  {
    name: 'Dr. Robert Wilson',
    specialization: 'Orthopedics',
    email: 'robert.wilson@clinic.com',
    phone: '+1234567893',
    experience: 20,
    timings: {
      start: '09:30',
      end: '17:30'
    },
    availableDays: ['Tuesday', 'Thursday', 'Saturday']
  }
];

const sampleDoctorUsers = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@clinic.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1234567890'
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@clinic.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1234567891'
  },
  {
    name: 'Dr. Emily Davis',
    email: 'emily.davis@clinic.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1234567892'
  },
  {
    name: 'Dr. Robert Wilson',
    email: 'robert.wilson@clinic.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1234567893'
  }
];

const adminUser = {
  name: 'System Administrator',
  email: 'admin@clinic.com',
  password: 'admin123',
  role: 'admin',
  phone: '+1234567800'
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Doctor.deleteMany({});
    await User.deleteMany({}); // Clear all users including admin
    console.log('Cleared existing doctors and users');

    // Insert admin user
    await User.create(adminUser);
    console.log('Admin user added successfully');

    // Insert sample doctors
    await Doctor.insertMany(sampleDoctors);
    console.log('Sample doctors added successfully');

    // Insert sample doctor users
    await User.insertMany(sampleDoctorUsers);
    console.log('Sample doctor users added successfully');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase();