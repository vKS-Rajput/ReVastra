import React from 'react';
import Title from '../components/Title';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelopeOpenText } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 py-8 px-4 sm:px-8">
      {/* Title Section */}
      <div className="text-center text-3xl font-semibold text-neutral-800 dark:text-neutral-200 py-8">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* Decorative Element (Gradient Background) */}
      <div className="h-1 w-16 bg-gradient-to-r from-red-400 to-pink-600 rounded mb-6 mx-auto"></div>

      {/* Contact Content */}
      <div className="my-10 flex flex-col lg:flex-row gap-16 lg:px-16">
        {/* Contact Details */}
        <div className="flex flex-col justify-center items-start gap-8 lg:w-2/4">
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Reach Out to Us</h3>
          <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400 mb-8">
            We’re here to help! Get in touch through any of the methods below, and our team will respond as soon as possible.
          </p>

          {/* Address and Contact Info with Icons */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 text-2xl" />
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">1234 Street Name, City, State, 12345</span>
            </div>
            <div className="flex items-center gap-4 bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <FaPhoneAlt className="text-green-600 dark:text-green-400 text-2xl" />
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">+1 (234) 567-890</span>
            </div>
            <div className="flex items-center gap-4 bg-gradient-to-r from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-800/20 p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <FaEnvelopeOpenText className="text-pink-600 dark:text-pink-400 text-2xl" />
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">info@example.com</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full lg:w-2/4 mt-10 lg:mt-0">
          <form className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-neutral-600 dark:text-neutral-400 text-lg">Name</label>
              <input
                type="text"
                id="name"
                className="border border-neutral-300 dark:border-neutral-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#E63946] transition-colors bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                placeholder="Your Name"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-neutral-600 dark:text-neutral-400 text-lg">Email</label>
              <input
                type="email"
                id="email"
                className="border border-neutral-300 dark:border-neutral-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#E63946] transition-colors bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                placeholder="Your Email"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="message" className="text-neutral-600 dark:text-neutral-400 text-lg">Message</label>
              <textarea
                id="message"
                rows="6"
                className="border border-neutral-300 dark:border-neutral-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#E63946] transition-colors bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                placeholder="Your Message"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#E63946] text-white py-4 rounded-lg hover:shadow-lg hover:bg-[#E63946] transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Job Contact Section */}
      {/* <div className="my-16 px-4 lg:px-16">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact for Job Inquiries</h3>
        <p className="text-base leading-relaxed text-gray-600 mb-8">
          Interested in joining our team? Fill out the form below to submit your resume or inquire about job opportunities.
        </p>
        <form className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="job-name" className="text-gray-600 text-lg">Name</label>
            <input
              type="text"
              id="job-name"
              className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#E63946] transition-colors"
              placeholder="Your Name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="job-email" className="text-gray-600 text-lg">Email</label>
            <input
              type="email"
              id="job-email"
              className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#E63946] transition-colors"
              placeholder="Your Email"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="job-message" className="text-gray-600 text-lg">Your Message</label>
            <textarea
              id="job-message"
              rows="6"
              className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#E63946] transition-colors"
              placeholder="Why you want to join us?"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#E63946] text-white py-4 rounded-lg hover:shadow-lg hover:bg-[#E63946] transition duration-300"
          >
            Submit Job Inquiry
          </button>
        </form>
      </div> */}

      {/* Map Section */}
      <div className="mt-16 px-4 lg:px-16">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">Our Location</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">Visit us at our office for a friendly chat and personalized assistance.</p>
          {/* Map Placeholder */}
          <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-700 rounded-lg">
            <p className="text-neutral-400 dark:text-neutral-500 pt-24">[Map Placeholder]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
