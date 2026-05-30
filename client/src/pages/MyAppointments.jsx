import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { predictWaitTime } from '../services/aiService';
import { sendQueueUpdateNotification } from '../services/notificationService';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApt, setSelectedApt] = useState(null);

  useEffect(() => {
    fetchAppointments();

    // Connect to socket for real-time updates
    const newSocket = io('http://localhost:5000');

    newSocket.on('appointmentUpdate', (data) => {
      // Update appointment status in real-time
      setAppointments(prev =>
        prev.map(apt => {
          if (apt._id === data.appointmentId) {
            const updated = { ...apt, status: data.status };
            // Send notification on queue update
            if (data.status === 'in_queue') {
              sendQueueUpdateNotification(updated, 0, data.estimatedWaitTime);
            }
            return updated;
          }
          return apt;
        })
      );
    });

    return () => newSocket.close();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/api/appointments/my');
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'dark:bg-slate-700 dark:text-slate-200 bg-slate-100 text-slate-800';
      case 'confirmed': return 'dark:bg-blue-900 dark:text-blue-200 bg-blue-100 text-blue-800';
      case 'checked_in': return 'dark:bg-cyan-900 dark:text-cyan-200 bg-cyan-100 text-cyan-800';
      case 'in_queue': return 'dark:bg-yellow-900 dark:text-yellow-200 bg-yellow-100 text-yellow-800';
      case 'consulting': return 'dark:bg-orange-900 dark:text-orange-200 bg-orange-100 text-orange-800';
      case 'completed': return 'dark:bg-green-900 dark:text-green-200 bg-green-100 text-green-800';
      case 'cancelled': return 'dark:bg-red-900 dark:text-red-200 bg-red-100 text-red-800';
      case 'booked': return 'dark:bg-blue-900 dark:text-blue-200 bg-blue-100 text-blue-800';
      case 'waiting': return 'dark:bg-yellow-900 dark:text-yellow-200 bg-yellow-100 text-yellow-800';
      case 'ongoing': return 'dark:bg-orange-900 dark:text-orange-200 bg-orange-100 text-orange-800';
      default: return 'dark:bg-slate-700 dark:text-slate-200 bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return '⏳ Pending';
      case 'confirmed': return '✅ Confirmed';
      case 'checked_in': return '📍 Checked-In';
      case 'in_queue': return '👥 In Queue';
      case 'consulting': return '👨‍⚕️ Consulting';
      case 'completed': return '✔️ Completed';
      case 'cancelled': return '❌ Cancelled';
      case 'booked': return '📅 Booked';
      case 'waiting': return '⏳ Waiting';
      case 'ongoing': return '🔄 Ongoing';
      default: return 'Unknown';
    }
  };

  const getWaitTimeEstimate = (apt) => {
    // Use AI to predict wait time
    if (apt.doctor) {
      return predictWaitTime([], apt.doctor, 1);
    }
    return apt.estimatedWaitTime || 0;
  };

  if (loading) {
    return <div className="text-center p-8 dark:text-slate-300">⏳ Loading appointments...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 dark:text-white">📅 My Appointments</h1>

        {appointments.length === 0 ? (
          <div className="text-center bg-blue-50 dark:bg-slate-800 rounded-lg p-12">
            <p className="text-lg dark:text-slate-300">No appointments found. Let's book one!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900 p-6 hover:shadow-lg dark:hover:shadow-slate-800 transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold dark:text-white">{appointment.doctor.name}</h2>
                    <p className="text-gray-600 dark:text-slate-400">{appointment.doctor.specialization}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded">
                    <p className="text-sm text-gray-600 dark:text-slate-400">📅 Date</p>
                    <p className="font-semibold dark:text-slate-100">{new Date(appointment.date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded">
                    <p className="text-sm text-gray-600 dark:text-slate-400">🕐 Time</p>
                    <p className="font-semibold dark:text-slate-100">{appointment.time}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded">
                    <p className="text-sm text-gray-600 dark:text-slate-400">🎫 Token</p>
                    <p className="font-bold text-lg dark:text-slate-100">{appointment.tokenNumber}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded">
                    <p className="text-sm text-gray-600 dark:text-slate-400">💳 Payment</p>
                    <p className={`font-semibold ${appointment.payment?.status === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {appointment.payment?.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                    </p>
                  </div>
                </div>

                {['in_queue', 'confirmed', 'checked_in', 'booked', 'waiting', 'ongoing'].includes(appointment.status) && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 mb-4">
                    <p className="text-blue-900 dark:text-blue-300 text-sm font-medium">
                      ⏱️ <strong>Estimated wait time:</strong> {getWaitTimeEstimate(appointment)} minutes
                    </p>
                  </div>
                )}

                {appointment.status === 'in_queue' && (
                  <button
                    onClick={() => setSelectedApt(appointment)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    📍 Check Queue Position
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;