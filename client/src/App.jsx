import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginSelector from './pages/LoginSelector';
import Login from './pages/Login';
import PatientLogin from './pages/PatientLogin';
import DoctorLogin from './pages/DoctorLogin';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import RegisterSelector from './pages/RegisterSelector';
import PatientRegister from './pages/PatientRegister';
import DoctorRegister from './pages/DoctorRegister';
import DoctorList from './pages/DoctorList';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 dark:text-slate-100">
          <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(prev => !prev)} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginSelector />} />
              <Route path="/login/patient" element={<div className="container mx-auto px-4 py-8"><PatientLogin /></div>} />
              <Route path="/login/doctor" element={<div className="container mx-auto px-4 py-8"><DoctorLogin /></div>} />
              <Route path="/login/admin" element={<div className="container mx-auto px-4 py-8"><AdminLogin /></div>} />
              <Route path="/register" element={<div className="container mx-auto px-4 py-8"><RegisterSelector /></div>} />
              <Route path="/register/patient" element={<div className="container mx-auto px-4 py-8"><PatientRegister /></div>} />
              <Route path="/register/doctor" element={<div className="container mx-auto px-4 py-8"><DoctorRegister /></div>} />
              <Route path="/register/admin" element={<div className="container mx-auto px-4 py-8"><Register /></div>} />
              <Route path="/doctors" element={<div className="container mx-auto px-4 py-8"><DoctorList /></div>} />
              <Route path="/book/:doctorId" element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8"><BookAppointment /></div>
                </ProtectedRoute>
              } />
              <Route path="/my-appointments" element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8"><MyAppointments /></div>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <div className="container mx-auto px-4 py-8"><AdminDashboard /></div>
                </ProtectedRoute>
              } />
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute doctorOnly={true}>
                  <div className="container mx-auto px-4 py-8"><DoctorDashboard /></div>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;