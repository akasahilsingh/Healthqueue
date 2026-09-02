import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currency = "₹"
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);

    if (!dob || Number.isNaN(birthDate.getTime())) {
      return "N/A";
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const birthdayHasNotOccurred =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate());

    if (birthdayHasNotOccurred) {
      age -= 1;
    }

    return age;
  };
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
  const value = { calculateAge, slotsDateFormat, currency };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
