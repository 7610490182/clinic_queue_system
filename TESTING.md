# Testing Guide

This guide helps you test all features of the clinic queue system.

## Prerequisites

- Both backend (`npm run dev` on port 5000) and frontend (`npm run dev` on port 5173) running
- MongoDB connected and seeded with sample data
- Razorpay test credentials (for payment testing)

## Testing Workflows

### 1. User Registration & Authentication

**Test Patient Registration**
1. Go to http://localhost:5173
2. Click "Register"
3. Fill in details:
   - Name: "Test Patient"
   - Email: "patient.test@clinic.com"
   - Password: "TestPass123"
   - Phone: "+1234567890"
4. Should redirect to home, showing logged-in state

**Test Doctor Registration**
1. Go to http://localhost:5173/register
2. Fill in patient details above
3. Change role to "Doctor"
4. Fill in:
   - Specialization: "Cardiologist"
   - Experience: "5"
   - Start time: "09:00"
   - End time: "17:00"
   - Available days: Check all
5. Should create both User and Doctor records

**Test Login**
1. Logout (click profile dropdown)
2. Go to /login or /login/patient
3. Enter email and password
4. Should redirect to appropriate dashboard

### 2. Appointment Booking

**Test Valid Booking**
1. Login as patient
2. Go to "Doctors" or "Book Appointment"
3. Select a doctor
4. Choose future date (not today or past)
5. Choose time within doctor's hours (09:00-17:00)
6. Click "Book Appointment"
7. Should see token number and appointment confirmation

**Test Invalid Booking (Past Date)**
1. Try to book for yesterday's date
2. Should see error: "Cannot book appointments in the past"

**Test Invalid Booking (Outside Hours)**
1. Try to book at 08:00 (before doctor starts at 09:00)
2. Should see error: "Time must be between 09:00 and 17:00"

**Test Duplicate Booking**
1. Book appointment with Doctor A for 2025-06-05 at 10:00
2. Try to book same doctor, same date at different time
3. Should see error: "You already have a booking with this doctor for this date"

### 3. Appointment Cancellation

**Test Cancellation**
1. Login as patient
2. Go to "My Appointments"
3. Click "❌ Cancel Appointment" on any non-completed appointment
4. Confirm cancellation
5. Status should change to "❌ Cancelled"
6. Button should disappear

**Test Cannot Cancel Completed**
1. Admin completes an appointment
2. Patient tries to cancel
3. Cancel button should not appear
4. (Or API should return: "Cannot cancel a completed appointment")

### 4. Payment Processing

**Test Razorpay Integration (Mock Mode)**
1. Book appointment
2. Click "Pay Now"
3. In mock mode, should see: "Payment completed in mock mode"
4. Should redirect to My Appointments

**Test Razorpay (Real Mode - if configured)**
1. With Razorpay test keys, see payment dialog
2. Test payment fails first, then succeeds
3. Payment should be verified

### 5. Doctor Dashboard

**Test Doctor View Their Appointments**
1. Login as doctor
2. Should see "Doctor Dashboard"
3. List shows today's appointments
4. Should see:
   - Patient name
   - Token number
   - Time slot
   - Contact info
   - Current status

**Test Call Next**
1. Click "Call Next" button
2. Should show next patient in queue
3. Status should change to "Consulting"
4. Patient should see real-time update

**Test Complete Appointment**
1. After consulting, click "Complete"
2. Status should change to "Completed"
3. Patient should see update in real-time

### 6. Admin Dashboard

**Test View All Appointments**
1. Login as admin
2. Should see list of ALL appointments with:
   - Patient name
   - Doctor name
   - Date & time
   - Current status
   - Token number

**Test Queue Management**
1. Select doctor from dropdown
2. Select date from calendar
3. Queue should show only that doctor's appointments for that date
4. Can mark "Call Next", "Start", "Complete"

**Test Add Doctor**
1. Click "Add Doctor" button
2. Fill in all fields
3. Should appear in doctors list below

**Test Edit Doctor**
1. Click edit icon on doctor card
2. Update fields
3. Changes should be reflected

**Test Delete Doctor**
1. Click delete icon on doctor card
2. Confirm deletion
3. Doctor should disappear from list

**Test Admin Statistics**
1. Should see three stat cards:
   - Total Patients: Count of all appointments
   - Completed Appointments: Count where status = completed
   - Total Earnings: Sum of paid appointments

### 7. Real-time Features

**Test Real-time Updates**
1. Open two browser windows: one as doctor, one as patient
2. In doctor window, call next patient
3. In patient window, should see status change immediately
4. No page refresh needed

**Test Queue Position Updates**
1. Multiple patients book appointments
2. Each should see their position in real-time
3. When a patient is served, others see their position decrease

### 8. Search & Filter

**Test Doctor Search by Specialization**
1. Go to Doctors page
2. Use specialization filter
3. Should only show doctors with that specialization

**Test Doctor Search by Symptom**
1. Go to Doctors page
2. Enter symptom in search (e.g., "chest pain")
3. Should show relevant doctors

### 9. Error Handling

**Test Missing Required Fields**
- Try to register without email
- Try to book without selecting date
- Should show error message

**Test Invalid Email**
- Register with invalid email format
- Should show validation error

**Test Weak Password**
- Register with password < 6 characters
- Should show: "Password must be at least 6 characters long"

**Test Unauthorized Access**
- Login as patient
- Try to access admin endpoints manually
- Should get 403 Forbidden error

**Test Database Connection Error**
- Stop MongoDB
- Try any operation
- Should see "Connection failed" or retry message

### 10. Performance Testing

**Test with Many Appointments**
- Create 100+ appointments in database
- Admin dashboard should still load
- Queue filtering should be fast

**Test Socket.io Scalability**
- Multiple clients connected
- Real-time updates should work for all
- No lag or connection drops

## API Testing (Using Postman/cURL)

### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123","role":"patient"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}'

# Get current user (use token from login)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Appointments
```bash
# Book appointment
curl -X POST http://localhost:5000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId":"DOCTOR_ID",
    "date":"2025-06-05",
    "time":"10:00"
  }'

# Get my appointments
curl -X GET http://localhost:5000/api/appointments/my \
  -H "Authorization: Bearer YOUR_TOKEN"

# Cancel appointment
curl -X DELETE http://localhost:5000/api/appointments/APPOINTMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Queue
```bash
# Get queue for doctor
curl -X GET "http://localhost:5000/api/appointments/queue/DOCTOR_ID/2025-06-05" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Regression Testing Checklist

After each change, verify:
- [ ] Users can register
- [ ] Users can login
- [ ] Patients can book appointments
- [ ] Appointments cannot be booked in past
- [ ] Appointments cannot be booked outside doctor hours
- [ ] Duplicate bookings are prevented
- [ ] Cancellation works
- [ ] Payment verification works
- [ ] Admin can manage doctors
- [ ] Admin can view all appointments
- [ ] Real-time updates work
- [ ] Socket.io connections are established
- [ ] No console errors in browser
- [ ] No error stack traces in browser network tab

## Performance Metrics

Monitor these metrics:
- API response time: < 200ms
- Real-time update latency: < 1s
- Frontend load time: < 3s
- Socket.io connection time: < 500ms

## Known Test Issues

1. **Razorpay Modal**: Use test card 4111111111111111 with any CVV
2. **Email Service**: Currently not sending emails (enhance in ENHANCEMENTS.md)
3. **SMS Notifications**: Currently not implemented (enhance in ENHANCEMENTS.md)
4. **MongoDB Mock**: Using mock payment verification in dev mode

## Success Criteria

✅ All tests passing
✅ No console errors
✅ Real-time updates working
✅ All validations working
✅ Error messages clear
✅ Performance acceptable
✅ Security checks passing
