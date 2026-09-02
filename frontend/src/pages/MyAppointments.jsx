import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import axios from "axios";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotsDateFormat = (slotDate) => {
    if (!slotDate) return "Date unavailable";

    const dateArray = slotDate.split(/[-_]/);
    if (dateArray.length < 3) return slotDate;

    const day = dateArray[0];
    const month = Number(dateArray[1]);
    const year = dateArray[2];

    return `${day} ${months[month - 1] || ""} ${year}`;
  };

  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        const fetchedAppointments = Array.isArray(data.appointments)
          ? data.appointments
          : [];
        setAppointments(fetchedAppointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointment();
        getDoctorsData();
      } else {
        toast.error(DataTransferItem.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const appointmentRazorPay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointment();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium">My Appointments</p>
      <div>
        {appointments.map((appointment, index) => {
          const doctor = appointment.docData || {};
          const address = doctor.address || {};

          return (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:gap-6 py-2 border-b"
              key={appointment._id || index}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={doctor.image}
                  alt={doctor.name}
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{doctor.name}</p>
                <p>{doctor.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{address.line1}</p>
                <p className="text-xs">{address.line2}</p>
                <p className="text-sm mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time:
                  </span>{" "}
                  {slotsDateFormat(appointment.slotDate)} |{" "}
                  {appointment.slotTime}
                </p>
              </div>

              <div></div>
              <div className="flex flex-col gap-2 justify-end">
                {!appointment.cancelled && (
                  <button
                    onClick={() => appointmentRazorPay(appointment._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:text-white hover:bg-primary transition-all duration-300"
                  >
                    Pay Online
                  </button>
                )}
                {!appointment.cancelled && (
                  <button
                    onClick={() => cancelAppointment(appointment._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:text-white hover:bg-red-600 transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                )}
                {appointment.cancelled && (
                  <button className="sm:min-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment Cancelled
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointments;
