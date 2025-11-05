import React, { useContext } from "react";
import Login from "./Pages/Login";
import { ToastContainer, toast } from "react-toastify";
import { AdminContext } from "../Context/appContext";

const App = () => {
  const { aToken } = useContext(AdminContext);
  return aToken ? (
    <div>
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
