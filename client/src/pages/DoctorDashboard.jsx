 import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    completedToday: 0,
    earningsToday: 0
  });

  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  useEffect(() => {
    const newSocket = io(socketUrl);

    newSocket.on('appointmentUpdate', () => {
      fetchDoctorData();
    });

    fetchDoctorData();

    return () => {
      newSocket.disconnect();
    };
  }, [socketUrl]);

  const fetchDoctorData = async () => {
    try {
      const response = await fetch('/api/appointments/doctor', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAppointments(data.appointments || []);
      setQueue(data.queue || []);
      setStats(data.stats || stats);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    }
  };

  const callNextPatient = async () => {
    try {
      const response = await fetch('/api/appointments/call-next', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCurrentPatient(data.patient);
        fetchDoctorData();
      }
    } catch (error) {
      console.error('Error calling next patient:', error);
    }
  };

  const completeAppointment = async () => {
    if (!currentPatient) return;

    try {
      const response = await fetch(`/api/appointments/complete/${currentPatient._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCurrentPatient(null);
        fetchDoctorData();
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
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
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'checked_in': return 'Checked-In';
      case 'in_queue': return 'In Queue';
      case 'consulting': return 'Consulting';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'booked': return 'Booked';
      case 'waiting': return 'Waiting';
      case 'ongoing': return 'Ongoing';
      default: return 'Unknown';
    }
  };

  const todayAppointments = appointments.filter(apt =>
    new Date(apt.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-950 dark:to-slate-900 py-8 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900 text-white rounded-2xl p-8 mb-8 shadow-xl dark:shadow-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">👨‍⚕️ Doctor Dashboard</h1>
              <p className="text-purple-100 dark:text-purple-300 text-lg">Welcome back, Dr. {user?.name}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{new Date().toLocaleDateString()}</div>
              <div className="text-purple-200 dark:text-purple-400">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <div className="text-blue-100">Today's Appointments</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-xl">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <div className="text-green-100">Completed Today</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-6 rounded-2xl shadow-xl">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-2xl font-bold">₹{stats.earningsToday}</div>
            <div className="text-yellow-100">Earnings Today</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Patient */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-purple-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">🎯 Current Patient</h2>
            {currentPatient ? (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="text-5xl mr-4">👤</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{currentPatient.patientName}</h3>
                    <p className="text-gray-600">Token: #{currentPatient.tokenNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-sm text-gray-500">Time:</span>
                    <div className="font-semibold">{currentPatient.timeSlot}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Contact:</span>
                    <div className="font-semibold">{currentPatient.contact}</div>
                  </div>
                </div>
                <button
                  onClick={completeAppointment}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition transform hover:scale-105"
                >
                  ✅ Complete Appointment
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-gray-500 text-lg mb-6">No patient currently being attended</p>
                <button
                  onClick={callNextPatient}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition transform hover:scale-105"
                >
                  📢 Call Next Patient
                </button>
              </div>
            )}
          </div>

          {/* Queue */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📋 Patient Queue</h2>
            {queue.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {queue.map((patient, index) => (
                  <div key={patient._id} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">#{index + 1}</div>
                        <div>
                          <div className="font-bold text-gray-800">{patient.patientName}</div>
                          <div className="text-sm text-gray-600">Token: #{patient.tokenNumber}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{patient.timeSlot}</div>
                        <div className="text-xs text-gray-400">{patient.contact}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 text-lg">No patients in queue</p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border-t-4 border-green-500">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">📅 Today's Appointments</h2>
          {todayAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todayAppointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{apt.tokenNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{apt.patientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{apt.timeSlot}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(apt.status)}`}>
                        {getStatusLabel(apt.status)}
                      </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{apt.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">No appointments scheduled for today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;