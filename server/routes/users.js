const express = require('express');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all patients (Admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a patient by ID (Admin only)
router.get('/:id', auth, adminAuth, async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select('-password');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient details (Admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updatedPatient = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete patient (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const deletedPatient = await User.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
