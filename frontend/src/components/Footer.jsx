import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

            {/* -------------Left Section---------- */}
            <div>
             <img className='mb-5 w-40' src={assets.logo} alt='logo'/>
             <p className='w-full md:w-2/3 text-gray-600 leading-6'>HealthQueue is your trusted healthcare companion, making it easy to find doctors, compare specialists, and book appointments online in minutes. Whether you need a consultation, lab test, or follow-up, we connect you with verified healthcare professionals and clinics near you. Manage your health smarter with HealthQueue — where care meets convenience.</p>
            </div>

             {/* -------------Center Section---------- */}
            <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Contact us</li>
                <li>Privacy policy</li>
            </ul>
            </div> 

            {/* -------------Right Section---------- */}
            <div>
             <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
              <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+91-987-654-1234</li>
                <li>contact@healthqueue.com</li>
              </ul>
            </div>                                                          
        </div>
        <div>
            {/* -------------Copuright Text----------*/}
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025 @ healthqueue.com - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer
