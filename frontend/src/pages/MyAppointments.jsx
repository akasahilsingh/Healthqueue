import React, { useCallback, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/errorMessage";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

let razorpayScript;

const loadRazorpay = () => {
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScript) return razorpayScript;

  razorpayScript = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return razorpayScript;
};

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
  const navigate = useNavigate();

  const slotsDateFormat = (slotDate) => {
    if (!slotDate) return "Date unavailable";

    const dateArray = slotDate.split(/[-_]/);
    if (dateArray.length < 3) return slotDate;

    const day = dateArray[0];
    const month = Number(dateArray[1]);
    const year = dateArray[2];

    return `${day} ${months[month - 1] || ""} ${year}`;
  };

  const getUserAppointment = useCallback(async () => {
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
      toast.error(getErrorMessage(error, backendUrl));
    }
  }, [backendUrl, token]);

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
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, backendUrl));
    }
  };

  const initPay = (order, keyId) => {
    if (!keyId || !order?.id || !order?.amount || !order?.currency) {
      toast.error("Payment order is not configured correctly");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment service is unavailable. Please try again");
      return;
    }

    if (!keyId.startsWith("rzp_test_") && !keyId.startsWith("rzp_live_")) {
      toast.error("Razorpay key is not configured");
      return;
    }

    const options = {
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-razorpay`,
            response,
            { headers: { token } },
          );
          if (data.success) {
            toast.success(data.message);
            getUserAppointment();
            navigate("/my-appointments");
          } else {
            toast.error(data.message || "Payment verification failed");
          }
        } catch (error) {
          toast.error(getErrorMessage(error, backendUrl));
        }
      },
      modal: {
        ondismiss: () => toast.info("Payment window closed"),
      },
      notes: {
        appointment_id: order.receipt,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const appointmentRazorPay = async (appointmentId) => {
    try {
      const isRazorpayReady = await loadRazorpay();
      if (!isRazorpayReady) {
        toast.error("Payment service is unavailable. Please try again");
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        initPay(data.order, data.keyId);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, backendUrl));
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointment();
    }
  }, [token, getUserAppointment]);

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
                  className="w-32 aspect-square object-cover bg-indigo-50"
                  src={doctor.image}
                  alt={doctor.name}
                  width="128"
                  height="128"
                  loading="lazy"
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
                {!appointment.cancelled && appointment.payment && <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">Paid</button>}
                {appointment.cancelled ? (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment Cancelled
                  </button>
                ) : appointment.isCompleted ? (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Completed
                  </button>
                ) : (
                  <>
                    {!appointment.payment && (
                      <button
                        onClick={() => appointmentRazorPay(appointment._id)}
                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:text-white hover:bg-primary transition-all duration-300"
                      >
                        Pay Online
                      </button>
                    )}
                    <button
                      onClick={() => cancelAppointment(appointment._id)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:text-white hover:bg-red-600 transition-all duration-300"
                    >
                      Cancel Appointment
                    </button>
                  </>
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
