import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();
  console.log(speciality);
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter((doctor) => doctor.speciality === speciality)
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [speciality, doctors]);

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex itmems-end gap-x-5 mt-5">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          <p onClick={()=> speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? "text-black bg-indigo-100" : ""}`}>General physician</p>
          <p onClick={()=> speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gynecologist' ? "text-black bg-indigo-100" : ""}`}>Gynecologist</p>
          <p onClick={()=> speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatologist' ? "text-black bg-indigo-100" : ""}`}>Dermatologist</p>
          <p onClick={()=> speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatricians' ? "text-black bg-indigo-100" : ""}`}>Pediatricians</p>
          <p onClick={()=> speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist' ? "text-black bg-indigo-100" : ""}`}>Neurologist</p>
          <p onClick={()=> speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? "text-black bg-indigo-100" : ""}`}>Gastroenterologist</p>
        </div>
      </div>
      <div className="w-full grid md:grid-cols-5 grid-cols-2 gap-4 gap-y-6">
      {filterDoc.map((doctor, index) => (
        <div
          onClick={() => navigate(`/appointment/${doctor._id}`)}
          className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          key={index}
        >
          <img className="bg-blue-50" src={doctor.image} alt="doctors image" />
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm text-center text-green-500">
              <p className="w-2 h-2 bg-green-500 rounded-full"></p>
              <p>Available</p>
            </div>
            <p className="text-gray-900 text-lg font-medium">{doctor.name}</p>
            <p className="text-gray-600 text-sm">{doctor.speciality}</p>
          </div>
        </div>
      ))}</div>
      </div>
    </div>
  );
};

export default Doctors;
