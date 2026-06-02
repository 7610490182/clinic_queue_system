const express = require('express');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add doctor (Admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name, specialization, email, phone, experience, timings, availableDays, password } = req.body;

    // Validate required fields
    if (!name || !specialization || !email || !experience) {
      return res.status(400).json({ message: 'Name, specialization, email, and experience are required' });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    // Check if user already exists for this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user account with this email already exists' });
    }

    const doctorUser = new User({
      name,
      email,
      phone,
      password: password || 'doctor123',
      role: 'doctor'
    });
    await doctorUser.save();

    const doctor = new Doctor({
      name,
      specialization,
      email,
      phone,
      experience,
      timings,
      availableDays
    });
    await doctor.save();

    res.status(201).json(doctor);
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Failed to add doctor', error: error.message });
  }
});

// Update doctor (Admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { email, name, phone, password } = req.body;
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    const doctorUser = await User.findOne({ email: doctor.email, role: 'doctor' });
    if (doctorUser) {
      const userUpdate = {};
      if (email) userUpdate.email = email;
      if (name) userUpdate.name = name;
      if (phone) userUpdate.phone = phone;

      if (Object.keys(userUpdate).length > 0) {
        await User.findOneAndUpdate(
          { email: doctor.email, role: 'doctor' },
          userUpdate,
          { new: true, runValidators: true }
        );
      }

      if (password) {
        doctorUser.password = password;
        await doctorUser.save();
      }
    }

    res.json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Failed to update doctor', error: error.message });
  }
});

// Delete doctor (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await User.findOneAndDelete({ email: doctor.email, role: 'doctor' });
    await Doctor.findByIdAndDelete(req.params.id);

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Failed to delete doctor', error: error.message });
  }
});

module.exports = router;