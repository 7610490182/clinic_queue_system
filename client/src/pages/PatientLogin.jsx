import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PatientLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'patient') {
        navigate('/doctors');
      } else {
        setError('Please login with a patient account');
      }
    } catch (error) {
      setError('Invalid credentials or not a patient account');
    } finally {
      setLoading(false);
    }
  };

  const patientBenefits = [
    '🏥 Access to qualified doctors',
    '📅 Easy appointment booking',
    '🎫 Real-time queue management',
    '💳 Secure online payments',
    '📱 Instant notifications',
    '📊 Appointment history tracking'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Benefits Section */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-10 rounded-3xl shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-7xl mb-6 animate-bounce">👤</div>
                <h2 className="text-4xl font-bold mb-4">Welcome Back, Patient!</h2>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Access your healthcare dashboard and manage your appointments with ease
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-6 text-center">Your Benefits</h3>
                {patientBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                    <span className="text-2xl mr-4">{benefit.split(' ')[0]}</span>
                    <span className="text-lg font-medium">{benefit.substring(benefit.indexOf(' ') + 1)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">10K+</div>
                  <div className="text-lg">Satisfied Patients</div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-t-4 border-blue-500">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 animate-pulse">👤</div>
                <h2 className="text-3xl font-bold text-gray-800">Patient Login</h2>
                <p className="text-gray-600 mt-2 text-lg">Access your health care dashboard</p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">⚠️</span>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                    <span className="text-xl mr-2">📧</span>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-lg"
                    placeholder="patient@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                    <span className="text-xl mr-2">🔒</span>
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-lg"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:shadow-outline transition-all transform hover:scale-105 duration-300 text-lg shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="text-xl mr-3">✅</span>
                      Login as Patient
                    </div>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 text-lg mb-4">
                  Don't have an account?
                </p>
                <Link
                  to="/register"
                  className="block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl font-bold text-center transition-all transform hover:scale-105 duration-300 shadow-lg text-lg"
                >
                  <span className="mr-2">🎯</span>
                  Register as Patient
                </Link>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors"
                >
                  ← Back to Role Selection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
