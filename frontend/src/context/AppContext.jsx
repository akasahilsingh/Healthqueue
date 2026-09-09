import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/errorMessage";

export const AppContext = createContext();

const AppContextProvider = (prop) => {
  const currencySymbol = "₹";
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.DEV
      ? "http://localhost:4000"
      : "https://healthqueue-knpw.onrender.com");

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let pendingApiCalls = 0;

  axios.interceptors = axios.interceptors || { request: [], response: [] };
  if (!axios.__healthqueueLoaderInstalled) {
    axios.interceptors.request.use((config) => {
      pendingApiCalls += 1;
      setIsLoading(true);
      return config;
    });

    axios.interceptors.response.use(
      (response) => {
        pendingApiCalls -= 1;
        if (pendingApiCalls <= 0) {
          setIsLoading(false);
          pendingApiCalls = 0;
        }
        return response;
      },
      (error) => {
        pendingApiCalls -= 1;
        if (pendingApiCalls <= 0) {
          setIsLoading(false);
          pendingApiCalls = 0;
        }
        return Promise.reject(error);
      },
    );

    axios.__healthqueueLoaderInstalled = true;
  }

  const updateToken = (newToken) => {
    setToken(newToken || "");
  };
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list", {
        withCredentials: true,
      });
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(getErrorMessage(error, backendUrl));
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        setUserData(false);
      }
    } catch (error) {
      setUserData(false);
    }
  };

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken: updateToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    isLoading,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    loadUserProfileData();
  }, []);

  return (
    <AppContext.Provider value={value}>{prop.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
