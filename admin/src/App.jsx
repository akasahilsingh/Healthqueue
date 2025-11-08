import React, { useContext } from "react";
import Login from "./Pages/Login";
import { ToastContainer, toast } from "react-toastify";
import { AdminContext } from "./Context/AdminContext.jsx";

const App = () => {
  const { atoken } = useContext(AdminContext);
  console.log("the context is: " , AdminContext)
  console.log("the a token is: ", atoken)
  return atoken ? (
    <div>
      <ToastContainer />
      {console.log("YOu are here on yes bolck")}
    </div>
  ) : (
    <>
    {console.log("you are here on noblocl")}
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
