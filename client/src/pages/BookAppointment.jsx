import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: ''
  });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const res = await axios.get(`/api/doctors/${doctorId}`);
      setDoctor(res.data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBooking(true);

    try {
      const res = await axios.post('/api/appointments', {
        doctorId,
        date: formData.date,
        time: formData.time
      });
      setAppointment(res.data);
      setShowPayment(true);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!appointment) return;

    try {
      const res = await axios.post('/api/payments/create-order', {
        appointmentId: appointment._id,
        amount: 500 // Fixed amount for demo
      });

      if (res.data.mock) {
        alert(res.data.message || 'Payment completed in mock mode.');
        navigate('/my-appointments');
        return;
      }

      await loadRazorpayScript();

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        order_id: res.data.orderId,
        name: 'Clinic Queue System',
        description: 'Appointment Payment',
        handler: async function (response) {
          try {
            await axios.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            alert('Payment successful! Appointment confirmed.');
            navigate('/my-appointments');
          } catch (error) {
            const message =
              error.response?.data?.message || 'Payment verification failed';
            alert(message);
          }
        },
        modal: {
          ondismiss: () => {
            alert('Payment was not completed. You can try again.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating payment:', error);
      const message =
        error.response?.data?.message || error.message || 'Failed to initiate payment';
      alert(message);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!doctor) {
    return <div className="text-center">Doctor not found</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900 p-6 text-slate-900 dark:text-slate-100">
      <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">📅 Book Appointment</h1>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded">
        <h2 className="font-semibold dark:text-slate-100">{doctor.name}</h2>
        <p className="text-gray-600 dark:text-slate-400">{doctor.specialization}</p>
        <p className="text-sm text-gray-500 dark:text-slate-500">
          Timings: {doctor.timings.start} - {doctor.timings.end}
        </p>
      </div>

      {!showPayment ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-slate-300 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              min={doctor.timings.start}
              max={doctor.timings.end}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={booking}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {booking ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          <p className="mb-2">Token Number: <span className="font-bold">{appointment.tokenNumber}</span></p>
          <p className="mb-2">Date: {new Date(appointment.date).toLocaleDateString()}</p>
          <p className="mb-4">Time: {appointment.time}</p>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Payment Required:</strong> ₹500
            </p>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;