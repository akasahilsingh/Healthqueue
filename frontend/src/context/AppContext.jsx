import { createContext, useEffect, useState } from "react";
// import { doctors } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (prop) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const updateToken = (newToken) => {
    setToken(newToken || "");
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const value = {
    doctors,
    currencySymbol,
    token,
    setToken: updateToken,
    backendUrl,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);
  return (
    <AppContext.Provider value={value}>{prop.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
