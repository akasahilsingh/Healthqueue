import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/errorMessage";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  let pendingApiCalls = 0;

  if (!axios.__healthqueueDoctorLoaderInstalled) {
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

    axios.__healthqueueDoctorLoaderInstalled = true;
  }

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.DEV
      ? "http://localhost:4000"
      : "https://healthqueue-knpw.onrender.com");

  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointment`,
        { withCredentials: true },
      );
      if (data.success) {
        setAppointments(data.appointments.reverse() || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, backendUrl));
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { withCredentials: true },
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, backendUrl));
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { withCredentials: true },
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, backendUrl));
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/dashboard`,
        { withCredentials: true },
      );
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, backendUrl));
    }
  };

  const getProfileData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/profile`,
        { withCredentials: true },
      );
      if (data.success) {
        setProfileData(data.profileData);
      } else {
        setProfileData(false);
      }
    } catch (error) {
      setProfileData(false);
    }
  }, [backendUrl]);

  const value = {
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    isLoading,
  };

  useEffect(() => {
    getProfileData();
  }, [getProfileData]);

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
