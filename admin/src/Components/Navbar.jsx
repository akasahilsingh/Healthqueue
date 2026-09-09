import React, { useContext } from 'react'
import axios from 'axios';
import { assets } from '../assets/assets'
import { AdminContext } from '../Context/AdminContext'
import { DoctorContext } from '../Context/Doctorcontext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { backendUrl, adminData, setAdminData } = useContext(AdminContext)
  const { setProfileData } = useContext(DoctorContext)
  const navigate = useNavigate()

  const logout = async () => {
    try {
      const route = adminData ? `${backendUrl}/api/admin/logout` : `${backendUrl}/api/doctor/logout`;
      await axios.post(route, {}, { withCredentials: true });
    } catch {
      // ignore and clear UI anyway
    } finally {
      setAdminData(false);
      setProfileData(false);
      navigate('/')
    }
  }

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{adminData ? "Admin" : "Doctor"}</p>
      </div>
      <button onClick={() => logout()} className="bg-primary text-white text-sm px-10 py-2 rounded-full">Logout</button>
    </div>
  )
}

export default Navbar
