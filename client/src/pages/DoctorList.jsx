import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('/api/doctors');
      const data = res.data;
      // Ensure we always store an array
      setDoctors(Array.isArray(data) ? data : (data?.doctors || []));
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const keyword = searchText.trim().toLowerCase();
    const specialization = doctor.specialization.toLowerCase();
    const name = doctor.name.toLowerCase();

    const matchesProblem = keyword
      ? specialization.includes(keyword) || name.includes(keyword)
      : true;

    const matchesSpecialization = specializationFilter
      ? specialization.includes(specializationFilter.toLowerCase())
      : true;

    return matchesProblem && matchesSpecialization;
  });

  if (loading) {
    return <div className="text-center">Loading doctors...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4">Our Doctors</h1>

      <div className="max-w-3xl mx-auto mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-700 mb-2">Search by your symptom / problem (e.g., fever, skin, heart).</p>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search symptom or doctor name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Filter by specialization"
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No doctors found for '{searchText || specializationFilter}'. Try a different keyword.
          </div>
        )}

        {filteredDoctors.map((doctor) => (
          <div key={doctor._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-44 bg-slate-100">
              <img
                src={doctor.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'}
                alt={doctor.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute left-4 top-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm">
                {doctor.rating?.toFixed(1) || '4.5'} ⭐ ({doctor.reviewCount || 0})
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-1">{doctor.name}</h2>
              <p className="text-gray-600 mb-2">{doctor.specialization}</p>
              {doctor.clinic && <p className="text-sm text-slate-500 mb-2">{doctor.clinic}</p>}
              <p className="text-sm text-gray-500 mb-2">Experience: {doctor.experience} years</p>
              <p className="text-sm text-gray-500 mb-2">Timings: {doctor.timings.start} - {doctor.timings.end}</p>
              <p className="text-sm text-gray-500 mb-4">{doctor.address}</p>
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Available Days:</p>
                <div className="flex flex-wrap gap-1">
                  {doctor.availableDays.map((day) => (
                    <span
                      key={day}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                to={`/book/${doctor._id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded block text-center"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DoctorList;