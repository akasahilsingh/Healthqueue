import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../Context/Doctorcontext";
import { useEffect } from "react";

const DoctorDashboard = () => {
  const { dtoken, dashData, setDashData, getDashData } =
    useContext(DoctorContext);
  useEffect(() => {
    if (dtoken) {
      getDashData();
    }
  }, [dtoken]);
  return dashData && <div></div>;
};

export default DoctorDashboard;
