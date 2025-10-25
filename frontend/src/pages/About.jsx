import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt="About"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            HealthQue is your trusted digital companion for managing healthcare
            effortlessly. We connect patients with verified doctors across
            various specialties, allowing you to book appointments quickly and
            securely—all from the comfort of your home. Whether you need a
            routine checkup, a specialist consultation, or an urgent care visit,
            HealthQue makes healthcare access simple, transparent, and
            convenient.
          </p>
          <p>
            Find the Right Doctor, Anytime, Anywhere With HealthQue’s
            intelligent search and filtering options, you can easily find
            doctors based on specialty, location, experience, ratings, and
            availability. Each doctor profile includes detailed information,
            helping you make informed decisions about your care. You can even
            read patient reviews and compare consultation fees before booking,
            ensuring that you receive the right care tailored to your needs.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            At HealthQue, our vision is to make quality healthcare easily
            accessible for everyone. We aim to connect patients with trusted
            doctors quickly and conveniently through a smart, reliable, and
            user-friendly platform.
          </p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Efficiency:</b>
          <p>
            HealthQue saves you time with quick, seamless appointment bookings
            and instant doctor availability updates—all in just a few clicks.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Convenience:</b>
          <p>
            Access trusted doctors anytime, anywhere. Book, reschedule, or
            cancel appointments easily from your phone or computer.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Personalization:</b>
          <p>
            Get tailored doctor recommendations and health reminders based on
            your preferences and medical needs, ensuring care that fits you
            best.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
