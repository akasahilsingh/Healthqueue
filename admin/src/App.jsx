import React, { useContext } from "react";
import Login from "./Pages/Login";
import { ToastContainer, toast } from "react-toastify";
import { AdminContext } from "./Context/AdminContext.jsx";

const App = () => {
  const { atoken } = useContext(AdminContext);
  return atoken ? (
    <div className="bg-[#f8f9fd]">
      <ToastContainer />
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
