import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/errorMessage";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [adminData, setAdminData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authInitializing, setAuthInitializing] = useState(true);
  let pendingApiCalls = 0;

  if (!axios.__healthqueueAdminLoaderInstalled) {
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

    axios.__healthqueueAdminLoaderInstalled = true;
  }
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsPagination, setAppointmentsPagination] = useState({
    totalAppointments: 0,
    limit: 10,
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [dashData, setDashData] = useState(false);
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.DEV
      ? "http://localhost:4000"
      : "");

  const loadAdminProfileData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/profile",
        { withCredentials: true },
      );

      if (data.success) {
        setAdminData(data.profile);
      } else {
        setAdminData(false);
      }
    } catch (error) {
      setAdminData(false);
    } finally {
      setAuthInitializing(false);
    }
  };

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctor",
        {},
        { withCredentials: true },
      );

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

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availibility",
        { docId },
        { withCredentials: true },
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, backendUrl));
    }
  };

  const getAllAppointments = async (page = 1, limit = 10) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/appointments?page=${page}&limit=${limit}`,
        { withCredentials: true },
      );

      if (data.success) {
        setAppointments(data.appointments);
        setAppointmentsPagination(data.pagination);
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
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { withCredentials: true },
      );

      if (data.success) {
        getAllAppointments(
          appointmentsPagination.currentPage,
          appointmentsPagination.limit,
        );
        toast.success(data.message);
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
        backendUrl + "/api/admin/dashboard",
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

  const value = {
    adminData,
    setAdminData,
    backendUrl,
    doctors,
    setDoctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    appointmentsPagination,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
    loadAdminProfileData,
    authInitializing,
    isLoading,
  };

  useEffect(() => {
    loadAdminProfileData();
  }, []);

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
