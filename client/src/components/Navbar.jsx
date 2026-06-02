import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-slate-800 dark:to-slate-900 text-white shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center py-5 gap-4">
          <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
            <span className="text-3xl">🏥</span>
            <span>MediQueue</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-sm md:text-base">👋 {user.name}</span>

                <Link to="/doctors" className="hover:text-blue-100 transition text-sm md:text-base">
                  👨‍⚕️ Find Doctors
                </Link>

                {user.role === 'patient' && (
                  <>
                    <Link to="/my-appointments" className="hover:text-blue-100 transition text-sm md:text-base">
                      📅 My Appointments
                    </Link>
                  </>
                )}

                {user.role === 'doctor' && (
                  <>
                    <Link to="/doctor-dashboard" className="hover:text-blue-100 transition text-sm md:text-base">
                      📊 Doctor Dashboard
                    </Link>
                    <Link to="/my-appointments" className="hover:text-blue-100 transition text-sm md:text-base">
                      📋 Manage Appointments
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className="hover:text-blue-100 transition text-sm md:text-base">
                      ⚙️ Admin Dashboard
                    </Link>
                    <Link to="/doctors" className="hover:text-blue-100 transition text-sm md:text-base">
                      👨‍⚕️ Manage Doctors
                    </Link>
                  </>
                )}

                <button
                  onClick={toggleDarkMode}
                  className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition font-semibold text-sm md:text-base"
                >
                  {darkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition font-semibold"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/doctors" className="hover:text-blue-100 transition font-semibold text-sm md:text-base">
                  👨‍⚕️ Find Doctors
                </Link>
                <Link to="/login" className="hover:text-blue-100 transition font-semibold text-sm md:text-base">
                  🔐 Login
                </Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition font-semibold text-sm md:text-base">
                  📝 Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;