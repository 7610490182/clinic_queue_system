const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Appointment = require('../models/Appointment');
const { auth } = require('../middleware/auth');

const router = express.Router();

const isRazorpayConfigured = () => {
  return (
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    !process.env.RAZORPAY_KEY_ID.includes('dummy') &&
    !process.env.RAZORPAY_KEY_SECRET.includes('dummy')
  );
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!isRazorpayConfigured()) {
      appointment.payment = {
        orderId: `mock_order_${appointmentId}`,
        paymentId: `mock_payment_${appointmentId}`,
        amount: amount,
        status: 'paid'
      };
      appointment.status = 'confirmed';
      await appointment.save();

      const io = req.app.get('io');
      if (io) {
        io.emit('appointmentUpdate', {
          appointmentId: appointment._id,
          status: appointment.status,
          tokenNumber: appointment.tokenNumber,
          doctorId: appointment.doctor
        });
      }

      return res.json({
        mock: true,
        message:
          'Razorpay is not configured. Payment completed in mock mode for local development.',
        orderId: appointment.payment.orderId,
        amount: amount * 100,
        currency: 'INR'
      });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency: 'INR',
      receipt: `receipt_${appointmentId}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    // Update appointment with order details
    appointment.payment = {
      orderId: order.id,
      amount: amount,
      status: 'pending'
    };
    await appointment.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update appointment payment status
      const appointment = await Appointment.findOneAndUpdate(
        { 'payment.orderId': razorpay_order_id },
        {
          'payment.paymentId': razorpay_payment_id,
          'payment.status': 'paid'
        },
        { new: true }
      );

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      appointment.status = 'confirmed';
      await appointment.save();

      const io = req.app.get('io');
      if (io) {
        io.emit('appointmentUpdate', {
          appointmentId: appointment._id,
          status: appointment.status,
          tokenNumber: appointment.tokenNumber,
          doctorId: appointment.doctor
        });
      }

      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;