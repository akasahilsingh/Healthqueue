import React, { useContext } from "react";
import Login from "./Pages/Login";
import { ToastContainer } from "react-toastify";
import { AdminContext } from "./Context/AdminContext.jsx";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Admin/Dashboard.jsx";
import AllAppointment from "./Pages/Admin/AllAppointment.jsx";
import AddDoctor from "./Pages/Admin/AddDoctor.jsx";
import DoctorsList from "./Pages/Admin/DoctorsList.jsx";
import { DoctorContext } from "./Context/Doctorcontext.jsx";
import DoctorDashboard from "./Pages/Doctor/DoctorDashboard.jsx";
import DoctorAppointments from "./Pages/Doctor/DoctorAppointments.jsx";
import DoctorProfile from "./Pages/Doctor/DoctorProfile.jsx";


const App = () => {
  const {
    adminData,
    authInitializing: adminAuthInitializing,
    isLoading: adminLoading,
  } = useContext(AdminContext);
  const {
    profileData,
    authInitializing: doctorAuthInitializing,
    isLoading: doctorLoading,
  } = useContext(DoctorContext);
  const isLoading = adminLoading || doctorLoading;
  const authInitializing = adminAuthInitializing || doctorAuthInitializing;

  if (authInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Checking session...
      </div>
    );
  }

  return adminData || profileData ? (
    <div className="bg-[#f8f9fd]">
      <ToastContainer />
      <Navbar />
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-lg">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm font-semibold text-gray-700">Loading...</span>
          </div>
        </div>
      )}
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointment />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />

          {/* Doctor Route */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
