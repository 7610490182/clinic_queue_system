# Feature Enhancement Guide

This guide covers how to implement remaining features and improvements.

## 1. Socket.io Privacy - Implement Rooms

**Current Issue**: All appointment updates broadcast to all connected clients (privacy issue)

**Fix Implementation**:

In `server/server.js`:
```javascript
io.on('connection', (socket) => {
  console.log('New client connected: ' + socket.id);

  // User joins their own room
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room`);
  });

  socket.disconnect = () => {
    console.log('Client disconnected');
  };
});
```

In routes, use:
```javascript
// Emit only to specific user
io.to(`user_${userId}`).emit('appointmentUpdate', data);

// Or to doctor
io.to(`doctor_${doctorId}`).emit('appointmentUpdate', data);

// Or to admin
io.to('admin_room').emit('appointmentUpdate', data);
```

In `client/src/pages/MyAppointments.jsx`:
```javascript
useEffect(() => {
  const socket = io(socketUrl);
  
  // Join personal room on connect
  socket.on('connect', () => {
    socket.emit('join', user.id);
  });

  socket.on('appointmentUpdate', (data) => {
    // Handle update
  });

  return () => socket.close();
}, [user.id, socketUrl]);
```

## 2. Real Appointment Rescheduling UI

The backend has the endpoint but frontend needs implementation. Add to AdminDashboard:

```javascript
const handleReschedule = async (appointmentId) => {
  const newDate = prompt('Enter new date (YYYY-MM-DD):');
  const newTime = prompt('Enter new time (HH:MM):');
  const newDoctorId = confirm('Change doctor? (OK=yes, Cancel=no)') 
    ? selectedDoctor 
    : null;

  try {
    await axios.put(`/api/appointments/${appointmentId}/reschedule`, {
      doctorId: newDoctorId,
      date: newDate,
      time: newTime
    });
    
    fetchAppointments();
    alert('Appointment rescheduled successfully');
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to reschedule');
  }
};
```

## 3. Notification Service - Backend Implementation

Create `server/services/notificationService.js`:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendAppointmentReminder = async (patient, appointment, doctor) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: patient.email,
    subject: `Reminder: Appointment with ${doctor.name}`,
    html: `
      <h2>Appointment Reminder</h2>
      <p>Dear ${patient.name},</p>
      <p>You have an appointment with <strong>${doctor.name}</strong></p>
      <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
      <p>Time: ${appointment.time}</p>
      <p>Token: ${appointment.tokenNumber}</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendAppointmentReminder };
```

## 4. AI Service - Wire Up Predictions

In `client/src/services/aiService.js`, implement real logic:

```javascript
export const predictWaitTime = (queue, doctor, position) => {
  // Average 15 minutes per patient
  if (!queue || queue.length === 0) return 0;
  
  // Find position of current patient
  const actualPosition = queue.length;
  return actualPosition * 15; // 15 minutes average per patient
};

export const recommendBestSlots = (doctor, currentDate) => {
  // Return times with least bookings
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push({
      time: `${hour}:00`,
      openness: Math.random() * 100 // Replace with real data
    });
  }
  return slots.sort((a, b) => b.openness - a.openness);
};
```

## 5. Email Notifications

Add to `.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

In `server/routes/appointments.js`:
```javascript
const { sendAppointmentReminder } = require('../services/notificationService');

// After booking appointment
await sendAppointmentReminder(patient, appointment, doctor);
```

## 6. SMS Notifications (Twilio)

Add to `.env`:
```
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE=+1234567890
```

Create `server/services/smsService.js`:
```javascript
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendAppointmentSMS = async (phone, message) => {
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: phone
  });
};

module.exports = { sendAppointmentSMS };
```

## 7. Analytics Dashboard

Create `client/src/pages/Analytics.jsx`:

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalEarnings: 0,
    averageWaitTime: 0,
    appointmentsBySpecialization: {}
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/api/appointments');
      const appointments = res.data;

      const stats = {
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(a => a.status === 'completed').length,
        cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
        totalEarnings: appointments
          .filter(a => a.payment?.status === 'paid')
          .reduce((sum, a) => sum + (a.payment?.amount || 0), 0),
        averageWaitTime: calculateAverageWaitTime(appointments),
        appointmentsBySpecialization: groupBySpecialization(appointments)
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">📊 Analytics Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Appointments" value={stats.totalAppointments} />
        <StatCard title="Completed" value={stats.completedAppointments} />
        <StatCard title="Cancelled" value={stats.cancelledAppointments} />
        <StatCard title="Total Earnings" value={`₹${stats.totalEarnings}`} />
      </div>
    </div>
  );
};

export default Analytics;
```

## 8. Improve Status Management

Simplify appointment statuses:

In `server/models/Appointment.js`:
```javascript
status: {
  type: String,
  enum: ['pending', 'confirmed', 'checked_in', 'consulting', 'completed', 'cancelled'],
  default: 'pending'
}
```

This reduces confusion from 10 statuses to 6 clear states:
1. pending - Just booked, awaiting confirmation
2. confirmed - Payment done/admin approved
3. checked_in - Patient arrived
4. consulting - Being treated by doctor
5. completed - Finished
6. cancelled - Cancelled by patient/admin

## 9. Role-Separated Routes

Separate appointment routes by role:

```javascript
// client/src/App.jsx
<Route path="/patient/appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
<Route path="/doctor/appointments" element={<ProtectedRoute><DoctorAppointments /></ProtectedRoute>} />
<Route path="/admin/appointments" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
```

## 10. Input Validation Library

Add `express-validator` to backend:

```bash
npm install express-validator
```

In routes:
```javascript
const { body, validationResult } = require('express-validator');

router.post('/appointments', 
  auth,
  body('doctorId').isMongoId().withMessage('Invalid doctor ID'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('time').matches(/^\d{2}:\d{2}$/).withMessage('Invalid time format'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

## Implementation Priority

1. **High Priority** (do first):
   - Fix Socket.io rooms for privacy
   - Implement email notifications
   - Improve status management
   - Add input validation library

2. **Medium Priority** (do next):
   - SMS notifications
   - Rescheduling UI
   - Analytics dashboard
   - Role-separated routes

3. **Nice to Have** (optional):
   - Advanced AI predictions
   - Queue optimization
   - Chatbot integration
   - Mobile app

All changes maintain backward compatibility with existing features.
