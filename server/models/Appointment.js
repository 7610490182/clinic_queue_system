const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  tokenNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked_in', 'in_queue', 'consulting', 'completed', 'cancelled', 'booked', 'waiting', 'ongoing'],
    default: 'pending'
  },
  payment: {
    orderId: String,
    paymentId: String,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    }
  },
  estimatedWaitTime: {
    type: Number, // in minutes
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
appointmentSchema.index({ doctor: 1, date: 1, tokenNumber: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);