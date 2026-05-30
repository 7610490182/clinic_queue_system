import { Link } from 'react-router-dom';

const LoginSelector = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-16">
          <div className="text-7xl mb-4">🏥</div>
          <h1 className="text-5xl font-bold text-white mb-4">MediQueue</h1>
          <p className="text-2xl text-blue-100">Select Your Role to Login</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Patient Login */}
          <Link
            to="/login/patient"
            className="group"
          >
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:scale-105 duration-300 cursor-pointer h-full flex flex-col items-center justify-center text-center text-white"
            >
              <div className="text-6xl mb-4 group-hover:scale-125 transition">👤</div>
              <h2 className="text-3xl font-bold mb-3">Patient</h2>
              <p className="text-blue-100 mb-6">Book appointments and manage your health</p>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-semibold">
                Continue as Patient
              </div>
            </div>
          </Link>

          {/* Doctor Login */}
          <Link
            to="/login/doctor"
            className="group"
          >
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:scale-105 duration-300 cursor-pointer h-full flex flex-col items-center justify-center text-center text-white"
            >
              <div className="text-6xl mb-4 group-hover:scale-125 transition">👨‍⚕️</div>
              <h2 className="text-3xl font-bold mb-3">Doctor</h2>
              <p className="text-purple-100 mb-6">Manage appointments and patients</p>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-semibold">
                Continue as Doctor
              </div>
            </div>
          </Link>

          {/* Admin Login */}
          <Link
            to="/login/admin"
            className="group"
          >
            <div className="bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:scale-105 duration-300 cursor-pointer h-full flex flex-col items-center justify-center text-center text-white"
            >
              <div className="text-6xl mb-4 group-hover:scale-125 transition">👑</div>
              <h2 className="text-3xl font-bold mb-3">Admin</h2>
              <p className="text-red-100 mb-6">Manage system and all operations</p>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-semibold">
                Continue as Admin
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-blue-100 text-lg mb-4">Don't have an account?</p>
          <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSelector;
