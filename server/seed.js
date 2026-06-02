const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const User = require('./models/User');
require('dotenv').config();

const sampleDoctors = [
  {
    name: 'Dr. Amit Sharma',
    specialization: 'ENT Specialist',
    clinic: 'Fortis Escorts Hospital, Gwalior',
    address: 'Lucknow Road, Near Gwalior Central Mall, Gwalior, MP',
    email: 'amit.sharma@gwaliorhealth.com',
    phone: '+919876543210',
    profileImage: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 312,
    reviews: [
      {
        name: 'Ritu Jain',
        rating: 5,
        comment: 'Excellent ENT consultation with great follow-up care.',
        imageUrl: 'https://randomuser.me/api/portraits/women/45.jpg'
      },
      {
        name: 'Amit Verma',
        rating: 5,
        comment: 'Very knowledgeable and patient. Recommended for sinus and ear issues.',
        imageUrl: 'https://randomuser.me/api/portraits/men/14.jpg'
      }
    ],
    experience: 18,
    timings: {
      start: '10:00',
      end: '18:00'
    },
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    name: 'Dr. Neha Verma',
    specialization: 'Dermatologist',
    clinic: 'Medanta Muljibhai Patel Institute, Gwalior',
    address: 'Sikanderpur Stadium Rd, Gwalior, MP',
    email: 'neha.verma@gwaliorskin.com',
    phone: '+919812345678',
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 224,
    reviews: [
      {
        name: 'Sunita Patel',
        rating: 5,
        comment: 'Helped me manage eczema with excellent advice and care.',
        imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      {
        name: 'Rahul Sharma',
        rating: 4,
        comment: 'Friendly staff and very clear treatment plan for acne.',
        imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
      }
    ],
    experience: 12,
    timings: {
      start: '11:00',
      end: '19:00'
    },
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday']
  },
  {
    name: 'Dr. Priya Singh',
    specialization: 'Pediatrician',
    clinic: 'Anand Hospital, Gwalior',
    address: 'Gurunanak Chowk, Morar, Gwalior, MP',
    email: 'priya.singh@gwaliorkids.com',
    phone: '+919809876543',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: 189,
    reviews: [
      {
        name: 'Meera Tiwari',
        rating: 5,
        comment: 'Very caring with children and explained everything clearly.',
        imageUrl: 'https://randomuser.me/api/portraits/women/22.jpg'
      },
      {
        name: 'Ankur Dubey',
        rating: 5,
        comment: 'Excellent pediatric care and good with newborns.',
        imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg'
      }
    ],
    experience: 14,
    timings: {
      start: '09:00',
      end: '16:00'
    },
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    name: 'Dr. Rajesh Gupta',
    specialization: 'Orthopedic Surgeon',
    clinic: 'Samved Hospital, Gwalior',
    address: 'Gwalior-Sheopur Road, Gwalior, MP',
    email: 'rajesh.gupta@gwaliorortho.com',
    phone: '+919812345679',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviewCount: 142,
    reviews: [
      {
        name: 'Vikram Chaudhary',
        rating: 5,
        comment: 'Resolved my knee pain after months of discomfort.',
        imageUrl: 'https://randomuser.me/api/portraits/men/30.jpg'
      },
      {
        name: 'Neetu Kapoor',
        rating: 4,
        comment: 'Good experience and very professional during consultation.',
        imageUrl: 'https://randomuser.me/api/portraits/women/33.jpg'
      }
    ],
    experience: 20,
    timings: {
      start: '10:00',
      end: '17:00'
    },
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday']
  },
  {
    name: 'Dr. Pooja Jain',
    specialization: 'Obstetrician & Gynecologist',
    clinic: 'Apollo Clinic, Gwalior',
    address: 'Sitemap Colony, Gwalior, MP',
    email: 'pooja.jain@gwaliorwomen.com',
    phone: '+919876543211',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 276,
    reviews: [
      {
        name: 'Geeta Rao',
        rating: 5,
        comment: 'Excellent care during pregnancy and very supportive.',
        imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        name: 'Sonal Mehta',
        rating: 5,
        comment: 'Highly recommended for gynecology consultations.',
        imageUrl: 'https://randomuser.me/api/portraits/women/36.jpg'
      }
    ],
    experience: 16,
    timings: {
      start: '11:00',
      end: '19:00'
    },
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday']
  }
];

const sampleDoctorUsers = [
  {
    name: 'Dr. Amit Sharma',
    email: 'amit.sharma@gwaliorhealth.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+919876543210'
  },
  {
    name: 'Dr. Neha Verma',
    email: 'neha.verma@gwaliorskin.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+919812345678'
  },
  {
    name: 'Dr. Priya Singh',
    email: 'priya.singh@gwaliorkids.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+919809876543'
  },
  {
    name: 'Dr. Rajesh Gupta',
    email: 'rajesh.gupta@gwaliorortho.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+919812345679'
  },
  {
    name: 'Dr. Pooja Jain',
    email: 'pooja.jain@gwaliorwomen.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+919876543211'
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
    const mongoUri = process.env.MONGO_URI;
    const isLocal = mongoUri && (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost'));
    const connectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000
    };

    // Only enable TLS/SSL options for non-local (Atlas) connections
    if (!isLocal) {
      connectOptions.tls = true;
      connectOptions.tlsAllowInvalidCertificates = true;
      connectOptions.ssl = true;
    }

    await mongoose.connect(mongoUri, connectOptions);
    console.log('Connected to MongoDB');

    // Check if we should skip clearing (for safety)
    const skipClear = process.env.SKIP_CLEAR === 'true';
    
    if (!skipClear) {
      // Clear existing data
      await Doctor.deleteMany({});
      await User.deleteMany({}); // Clear all users including admin
      console.log('Cleared existing doctors and users');
    } else {
      console.log('Skipping data clear (SKIP_CLEAR=true)');
    }

    // Insert admin user (only if doesn't exist)
    const adminExists = await User.findOne({ email: adminUser.email });
    if (!adminExists) {
      await User.create(adminUser);
      console.log('Admin user added successfully');
    } else {
      console.log('Admin user already exists, skipping...');
    }

    // Insert sample doctors (avoid duplicates)
    for (const doctor of sampleDoctors) {
      const exists = await Doctor.findOne({ email: doctor.email });
      if (!exists) {
        await Doctor.create(doctor);
      }
    }
    console.log('Sample doctors ensured in database');

    // Insert sample doctor users (avoid duplicates)
    for (const doctorUser of sampleDoctorUsers) {
      const exists = await User.findOne({ email: doctorUser.email });
      if (!exists) {
        await User.create(doctorUser);
      }
    }
    console.log('Sample doctor users ensured in database');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase();