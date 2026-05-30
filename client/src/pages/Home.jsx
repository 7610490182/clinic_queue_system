import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: '🏥',
      title: 'Smart Queue System',
      description: 'Real-time token numbers and estimated wait times',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '📱',
      title: 'Easy Booking',
      description: 'Book appointments online with instant confirmation',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      description: 'Safe Razorpay integration for hassle-free payments',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '👨‍⚕️',
      title: 'Expert Doctors',
      description: 'Browse qualified doctors by specialization',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: '📊',
      title: 'Admin Dashboard',
      description: 'Complete system management and analytics',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'Live queue status and appointment notifications',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const patientFeatures = [
    '🔍 Search doctors by symptom or specialty',
    '📅 View doctor availability and timings',
    '🎫 Get real-time queue position & token number',
    '💰 Make secure payments online',
    '📱 Receive SMS/email notifications',
    '📊 Track appointment history'
  ];

  const doctorFeatures = [
    '📋 Manage daily appointment schedule',
    '👥 View patient queue in real-time',
    '🎯 Call next patient with one click',
    '💵 Track daily earnings & statistics',
    '📱 Receive instant notifications',
    '📈 View performance analytics'
  ];

  const adminFeatures = [
    '👨‍⚕️ Add & manage doctor profiles',
    '📊 Monitor system-wide statistics',
    '⚙️ Configure system settings',
    '💰 Track revenue & payments',
    '📈 Generate detailed reports',
    '🔧 System maintenance & updates'
  ];

  const handleBrowseDoctors = () => {
    navigate('/doctors');
  };

  const handleViewAppointments = () => {
    navigate('/my-appointments');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Section - Ultra Modern */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
                <span className="text-2xl mr-2">🏥</span>
                <span className="font-semibold">MediQueue System</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Revolutionizing
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Healthcare
                </span>
                Management
              </h1>

              <p className="text-xl lg:text-2xl mb-12 text-blue-100 leading-relaxed max-w-2xl">
                Experience seamless appointments, intelligent queue management, and digital healthcare at your fingertips. Join thousands of satisfied patients and doctors.
              </p>

              {!user ? (
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  <Link
                    to="/login"
                    className="group bg-white text-blue-600 hover:bg-blue-50 px-12 py-4 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 hover:shadow-2xl duration-300 shadow-xl"
                  >
                    <span className="mr-2">🚀</span>
                    Get Started Now
                  </Link>
                  <Link
                    to="/register"
                    className="group bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 hover:shadow-2xl duration-300 shadow-xl"
                  >
                    <span className="mr-2">📝</span>
                    Join as Patient
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  {user.role === 'patient' && (
                    <button
                      onClick={handleBrowseDoctors}
                      className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-4 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 hover:shadow-2xl duration-300 shadow-xl"
                    >
                      <span className="mr-2">👨‍⚕️</span>
                      Browse Doctors
                    </button>
                  )}
                  {user.role === 'doctor' && (
                    <button
                      onClick={() => navigate('/doctor-dashboard')}
                      className="bg-white text-purple-600 hover:bg-purple-50 px-12 py-4 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 hover:shadow-2xl duration-300 shadow-xl"
                    >
                      <span className="mr-2">📊</span>
                      Doctor Dashboard
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="bg-white text-red-600 hover:bg-red-50 px-12 py-4 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 hover:shadow-2xl duration-300 shadow-xl"
                    >
                      <span className="mr-2">⚙️</span>
                      Admin Panel
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="text-center">
                  <div className="text-8xl mb-6 animate-bounce">🏥</div>
                  <h3 className="text-3xl font-bold mb-4">Smart Healthcare</h3>
                  <p className="text-blue-100 text-lg">Digital queue management for modern clinics</p>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-6 -left-6 bg-white/20 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20 animate-bounce delay-300">
                <div className="text-center">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-blue-100">Happy Patients</div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white/20 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20 animate-bounce delay-700">
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-blue-100">Expert Doctors</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20">
            <path fill="#ffffff" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Grid - Ultra Modern */}
      <section className="py-32 px-4 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              🚀 Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need for a seamless healthcare experience, from booking to payment and beyond
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white p-8 md:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 duration-500 border border-gray-100 hover:border-transparent hover:bg-gradient-to-br hover:from-white hover:to-gray-50 cursor-pointer"
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} text-white text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section - Enhanced */}
      <section className="py-32 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
              👥 Choose Your Role
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join our healthcare ecosystem as a patient, doctor, or administrator
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Patient Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-3xl shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-500 group">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-5xl mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  👤
                </div>
                <h3 className="text-3xl font-bold text-blue-800 mb-4">Patient</h3>
                <p className="text-blue-600 text-lg font-semibold">Access quality healthcare</p>
              </div>

              <div className="space-y-4 mb-8">
                {patientFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-gray-700 font-medium hover:text-blue-600 transition-colors">
                    <span className="text-xl mr-3">{feature.split(' ')[0]}</span>
                    <span className="text-lg">{feature.substring(feature.indexOf(' ') + 1)}</span>
                  </div>
                ))}
              </div>

              {!user && (
                <Link
                  to="/register"
                  className="block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-8 rounded-2xl font-bold text-center transition-all transform hover:scale-105 duration-300 shadow-lg text-lg"
                >
                  Register as Patient
                </Link>
              )}
            </div>

            {/* Doctor Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-10 rounded-3xl shadow-xl border-2 border-purple-200 hover:shadow-2xl transition-all duration-500 group">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-5xl mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  👨‍⚕️
                </div>
                <h3 className="text-3xl font-bold text-purple-800 mb-4">Doctor</h3>
                <p className="text-purple-600 text-lg font-semibold">Manage your practice efficiently</p>
              </div>

              <div className="space-y-4 mb-8">
                {doctorFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-gray-700 font-medium hover:text-purple-600 transition-colors">
                    <span className="text-xl mr-3">{feature.split(' ')[0]}</span>
                    <span className="text-lg">{feature.substring(feature.indexOf(' ') + 1)}</span>
                  </div>
                ))}
              </div>

              {!user && (
                <Link
                  to="/register"
                  className="block bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 px-8 rounded-2xl font-bold text-center transition-all transform hover:scale-105 duration-300 shadow-lg text-lg"
                >
                  Register as Doctor
                </Link>
              )}
            </div>

            {/* Admin Section */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-10 rounded-3xl shadow-xl border-2 border-red-200 hover:shadow-2xl transition-all duration-500 group">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-5xl mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  👑
                </div>
                <h3 className="text-3xl font-bold text-red-800 mb-4">Administrator</h3>
                <p className="text-red-600 text-lg font-semibold">Control the entire system</p>
              </div>

              <div className="space-y-4 mb-8">
                {adminFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-gray-700 font-medium hover:text-red-600 transition-colors">
                    <span className="text-xl mr-3">{feature.split(' ')[0]}</span>
                    <span className="text-lg">{feature.substring(feature.indexOf(' ') + 1)}</span>
                  </div>
                ))}
              </div>

              {!user && (
                <Link
                  to="/register"
                  className="block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-8 rounded-2xl font-bold text-center transition-all transform hover:scale-105 duration-300 shadow-lg text-lg"
                >
                  Register as Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      {user && user.role !== 'admin' && (
        <section className="py-32 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-8 text-8xl animate-bounce">🏥</div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Ready to Experience
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Smart Healthcare?
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-95 font-light leading-relaxed max-w-3xl mx-auto">
              Join thousands of patients and doctors who trust our platform for their healthcare needs
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              {user.role === 'patient' && (
                <>
                  <button
                    onClick={handleBrowseDoctors}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-110 duration-300 shadow-xl"
                  >
                    👨‍⚕️ Browse Doctors Now
                  </button>
                  <button
                    onClick={handleViewAppointments}
                    className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-110 duration-300 shadow-xl"
                  >
                    📅 View My Appointments
                  </button>
                </>
              )}
              {user.role === 'doctor' && (
                <>
                  <button
                    onClick={() => navigate('/doctor-dashboard')}
                    className="bg-white text-purple-600 hover:bg-purple-50 px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-110 duration-300 shadow-xl"
                  >
                    📊 Open Doctor Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/my-appointments')}
                    className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-110 duration-300 shadow-xl"
                  >
                    📋 Manage Appointments
                  </button>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <button
                    onClick={() => navigate('/admin')}
                    className="bg-white text-red-600 hover:bg-red-50 px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-110 duration-300 shadow-xl"
                  >
                    ⚙️ Admin Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/doctors')}
                    className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-110 duration-300 shadow-xl"
                  >
                    👨‍⚕️ Manage Doctors
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA - For Non-logged Users */}
      {!user && (
        <section className="py-32 px-4 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Start Your Healthcare
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                Journey Today
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-95 font-light leading-relaxed">
              Join our growing community of patients, doctors, and healthcare providers
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/login"
                className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-110 duration-300 shadow-xl"
              >
                🔐 Login to Your Account
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-110 duration-300 shadow-xl"
              >
                🎯 Create New Account
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;