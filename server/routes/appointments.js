const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get appointments for current user
router.get('/my', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialization')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments for current doctor
router.get('/doctor', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Doctor only.' });
    }

    const doctorRecord = await Doctor.findOne({ email: req.user.email });
    if (!doctorRecord) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctor: doctorRecord._id })
      .populate('patient', 'name phone email')
      .populate('doctor', 'name specialization')
      .sort({ date: 1, tokenNumber: 1 });

    const appointmentData = appointments.map((apt) => ({
      _id: apt._id,
      patientName: apt.patient?.name || 'Unknown',
      tokenNumber: apt.tokenNumber,
      timeSlot: apt.time,
      contact: apt.patient?.phone || apt.patient?.email || 'N/A',
      status: apt.status,
      date: apt.date
    }));

    const queue = appointmentData.filter((apt) => ['confirmed', 'checked_in', 'in_queue', 'consulting', 'booked', 'waiting', 'ongoing'].includes(apt.status));
    const todayAppointments = appointmentData.filter((apt) => new Date(apt.date).toDateString() === new Date().toDateString());
    const stats = {
      todayAppointments: todayAppointments.length,
      completedToday: todayAppointments.filter((apt) => apt.status === 'completed').length,
      earningsToday: appointments
        .filter((apt) => new Date(apt.date).toDateString() === new Date().toDateString() && apt.payment?.status === 'paid')
        .reduce((sum, apt) => sum + (apt.payment?.amount || 0), 0)
    };

    res.json({ appointments: appointmentData, queue, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Call next patient for current doctor
router.post('/call-next', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Doctor only.' });
    }

    const doctorRecord = await Doctor.findOne({ email: req.user.email });
    if (!doctorRecord) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const nextAppointment = await Appointment.findOne({
      doctor: doctorRecord._id,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['checked_in', 'confirmed', 'booked', 'waiting', 'ongoing'] }
    })
      .populate('patient', 'name phone email')
      .sort({ tokenNumber: 1 });

    if (!nextAppointment) {
      return res.json({ success: false, message: 'No patients in queue' });
    }

    nextAppointment.status = 'consulting';
    await nextAppointment.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('appointmentUpdate', {
        appointmentId: nextAppointment._id,
        status: nextAppointment.status,
        tokenNumber: nextAppointment.tokenNumber,
        doctorId: doctorRecord._id
      });
    }

    const patient = {
      _id: nextAppointment._id,
      patientName: nextAppointment.patient.name,
      tokenNumber: nextAppointment.tokenNumber,
      timeSlot: nextAppointment.time,
      contact: nextAppointment.patient.phone || nextAppointment.patient.email
    };

    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete the current appointment
router.post('/complete/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Doctor only.' });
    }

    const doctorRecord = await Doctor.findOne({ email: req.user.email });
    if (!doctorRecord) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: doctorRecord._id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'completed';
    await appointment.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('appointmentUpdate', {
        appointmentId: appointment._id,
        status: appointment.status,
        tokenNumber: appointment.tokenNumber,
        doctorId: doctorRecord._id
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments (Admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Book appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    // Validate required fields
    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: 'Doctor ID, date, and time are required' });
    }

    // Validate date is not in the past
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res.status(400).json({ message: 'Cannot book appointments in the past' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check for duplicate booking
    const existingAppointment = await Appointment.findOne({
      patient: req.user._id,
      doctor: doctorId,
      date: appointmentDate,
      status: { $nin: ['cancelled', 'completed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'You already have a booking with this doctor for this date' });
    }

    // Generate token number (auto-increment per day per doctor)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const lastAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ tokenNumber: -1 });

    const tokenNumber = lastAppointment ? lastAppointment.tokenNumber + 1 : 1;

    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      tokenNumber,
      status: 'pending'
    });

    await appointment.save();

    // Populate doctor info
    await appointment.populate('doctor', 'name specialization');

    const io = req.app.get('io');
    if (io) {
      io.emit('appointmentUpdate', {
        appointmentId: appointment._id,
        status: appointment.status,
        tokenNumber: appointment.tokenNumber,
        doctorId: appointment.doctor._id
      });
    }

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status (Admin only)
router.put('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('patient', 'name').populate('doctor', 'name');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.emit('appointmentUpdate', {
      appointmentId: appointment._id,
      status: appointment.status,
      tokenNumber: appointment.tokenNumber,
      doctorId: appointment.doctor._id
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reschedule appointment (Admin only)
router.put('/:id/reschedule', auth, adminAuth, async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (doctorId && doctorId !== String(appointment.doctor)) {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      appointment.doctor = doctorId;
    }

    if (date) {
      appointment.date = new Date(date);
    }
    if (time) {
      appointment.time = time;
    }

    if (doctorId || date) {
      const appointmentDate = new Date(appointment.date);
      const startOfDay = new Date(appointmentDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(appointmentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const lastAppointment = await Appointment.findOne({
        doctor: appointment.doctor,
        date: { $gte: startOfDay, $lte: endOfDay },
        _id: { $ne: appointment._id }
      }).sort({ tokenNumber: -1 });

      appointment.tokenNumber = lastAppointment ? lastAppointment.tokenNumber + 1 : 1;
    }

    await appointment.save();
    await appointment.populate('patient', 'name');
    await appointment.populate('doctor', 'name specialization');

    const io = req.app.get('io');
    io.emit('appointmentUpdate', {
      appointmentId: appointment._id,
      status: appointment.status,
      tokenNumber: appointment.tokenNumber,
      doctorId: appointment.doctor._id
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get queue for a doctor on a specific date
router.get('/queue/:doctorId/:date', auth, adminAuth, async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    
    if (!doctorId || !date) {
      return res.status(400).json({ message: 'Doctor ID and date are required' });
    }
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['confirmed', 'checked_in', 'in_queue', 'booked', 'waiting', 'ongoing'] }
    })
    .populate('patient', 'name')
    .sort({ tokenNumber: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({ message: 'Failed to fetch queue', error: error.message });
  }
});

// Cancel appointment (patient or admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization: patient can cancel own, admin can cancel any
    if (req.user.role !== 'admin' && appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    // Cannot cancel already completed or cancelled appointments
    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({ message: 'Cannot cancel a ' + appointment.status + ' appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Notify all clients about cancellation
    const io = req.app.get('io');
    if (io) {
      io.emit('appointmentUpdate', {
        appointmentId: appointment._id,
        status: appointment.status,
        tokenNumber: appointment.tokenNumber,
        doctorId: appointment.doctor
      });
    }

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Failed to cancel appointment', error: error.message });
  }
});

module.exports = router;