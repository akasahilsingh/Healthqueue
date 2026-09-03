import React, { useState } from "react";

import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets.js";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/errorMessage";
import axios from "axios";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name || "");
      formData.append("phone", String(userData.phone || ""));
      formData.append(
        "address",
        JSON.stringify(userData.address || { line1: "", line2: "" }),
      );
      formData.append("gender", userData.gender || "");
      formData.append("dob", userData.dob || "");

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } },
      );

      if (data?.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data?.message || "Profile update failed");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, backendUrl));
    }
  };

  if (!userData) {
    return (
      <div className="py-10 text-center text-gray-500">Loading profile...</div>
    );
  }

  const safeAddress = userData.address || { line1: "", line2: "" };

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      {isEdit ? (
        <label htmlFor="image">
          <div className="relative inline-block cursor-pointer">
            <img
              className="w-36 rounded opacity-50"
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="Profile"
            />
            <img
              src={assets.upload_icon}
              alt="Upload"
              className={`absolute bottom-3 right-12 w-10 h-10 rounded-full bg-white/80 p-2 shadow-md ${image ? "hidden" : ""}`}
            />
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </div>
        </label>
      ) : (
        <img className="w-36 rounded" src={userData.image} alt="Profile" />
      )}

      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
          value={userData.name}
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {userData.name}
        </p>
      )}
      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id: </p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
              value={userData.phone}
            />
          ) : (
            <p className="text-blue-400">{userData.phone}</p>
          )}
          <p className="font-medium">Address: </p>
          {isEdit ? (
            <div className="flex flex-col gap-2">
              <input
                className="bg-gray-100 max-w-52"
                onChange={({ target: { value } }) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: {
                      ...(prev.address || { line1: "", line2: "" }),
                      line1: value,
                    },
                  }))
                }
                value={safeAddress.line1 || ""}
                type="text"
              />
              <input
                className="bg-gray-100 max-w-52"
                onChange={({ target: { value } }) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: {
                      ...(prev.address || { line1: "", line2: "" }),
                      line2: value,
                    },
                  }))
                }
                value={safeAddress.line2 || ""}
                type="text"
              />
            </div>
          ) : (
            <p className="text-gray-500">
              {safeAddress.line1}
              <br />
              {safeAddress.line2}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender: </p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Other</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender}</p>
          )}
          <p className="text-medium">Birtday:</p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-100"
              type="date"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={userData.dob || ""}
            ></input>
          ) : (
            <p className="text-gray-400">{userData.dob || "Not Selected"}</p>
          )}
        </div>
      </div>
      <div className="mt-10">
        {isEdit ? (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={updateUserProfileData}
          >
            Save Information
          </button>
        ) : (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
