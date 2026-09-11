import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/errorMessage";

export const AppContext = createContext();

const AppContextProvider = (prop) => {
  const currencySymbol = "₹";
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.DEV ? "http://localhost:4000" : "");

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // True until the first auth check completes — prevents flash of logged-out UI on reload
  const [authInitializing, setAuthInitializing] = useState(true);
  let pendingApiCalls = 0;

  // Ref so the single-registered interceptor always calls the latest setUserData
  const setUserDataRef = useRef(setUserData);
  useEffect(() => {
    setUserDataRef.current = setUserData;
  });

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
      async (error) => {
        pendingApiCalls -= 1;
        if (pendingApiCalls <= 0) {
          setIsLoading(false);
          pendingApiCalls = 0;
        }

        const originalRequest = error.config;

        // If we get a 401 and haven't already retried, attempt a silent token refresh
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          // Don't try to refresh if the failing request IS the refresh endpoint (avoid loops)
          !originalRequest.url?.includes("/refresh-token") &&
          !originalRequest.url?.includes("/login") &&
          !originalRequest.url?.includes("/register")
        ) {
          originalRequest._retry = true;
          try {
            // Ask the server to issue a new access token using the refresh-token cookie
            await axios.post(
              backendUrl + "/api/user/refresh-token",
              {},
              { withCredentials: true },
            );
            // Retry the original request now that we have a fresh access token
            return axios(originalRequest);
          } catch {
            // Refresh token is also expired — force the user to re-login
            setUserDataRef.current(false);
          }
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
    } catch {
      setUserData(false);
    } finally {
      setAuthInitializing(false);
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
    authInitializing,
  };

  useEffect(() => {
    loadUserProfileData();
  }, []);

  return (
    <AppContext.Provider value={value}>{prop.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
