import React, { Suspense, lazy, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AppContext } from "./context/AppContext";

const Doctors = lazy(() => import("./pages/Doctors"));
const Login = lazy(() => import("./pages/Login"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const MyAppointments = lazy(() => import("./pages/MyAppointments"));
const Appointment = lazy(() => import("./pages/Appointment"));

const App = () => {
  const { isLoading } = useContext(AppContext);

  return (
    <div className="mx-4 sm:mx-[10%]">
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
      <Suspense fallback={<main className="min-h-[50vh]" aria-label="Loading page" />}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/doctors" element={<Doctors />}></Route>
          <Route path="/doctors/:speciality" element={<Doctors />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/my-profile" element={<MyProfile />}></Route>
          <Route path="/my-appointments" element={<MyAppointments />}></Route>
          <Route path="/appointment/:docId" element={<Appointment />}></Route>
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
};

export default App;
