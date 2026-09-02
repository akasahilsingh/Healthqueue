import React, { useContext } from "react";
import Login from "./Pages/Login";
import { ToastContainer, toast } from "react-toastify";
import { AdminContext } from "./Context/AdminContext.jsx";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Admin/Dashboard.jsx";
import AllAppointment from "./Pages/Admin/AllAppointment.jsx";
import AddDoctor from "./Pages/Admin/AddDoctor.jsx";
import DoctorsList from "./Pages/Admin/DoctorsList.jsx";

// const App = () => {
//   const { atoken } = useContext(AdminContext);
//   return atoken ? (
//     <div className="bg-[#f8f9fd]">
//       <ToastContainer />
//       <Navbar />
//       <div className="flex items-start">
//         <Sidebar />
//         <Routes>
//           <Route path="/" element={<></>} />
//           <Route path="/admin-dashboard" element={<Dashboard />} />
//           <Route path="/all-appointments" element={<AllAppointment />} />
//           <Route path="/add-doctor" element={<AddDoctor />} />
//           <Route path="/doctor-list" element={<DoctorsList />} />
//         </Routes>
//         </div>
//     </div>
//   ) : (
//     <>
//       <Login />
//       <ToastContainer />
//     </>
//   );
// };

// export default App;

//temp

const App = () => {
  const { atoken } = useContext(AdminContext);

  return atoken ? (
    <div className="bg-[#f8f9fd]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointment />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />
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
