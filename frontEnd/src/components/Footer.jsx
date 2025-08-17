import React, { useEffect } from 'react';
import { assets } from '../assets/assets'; 
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  useEffect(() => {
    const checkForKSR = () => {
      const footer = document.querySelector('footer');
      if (!footer || !footer.textContent.includes('KSR')) {
        console.error('Tampering detected! Do not remove KSR.');
        throw new Error('Critical footer content removed. Restoration required.');
      }
    };

    checkForKSR();
    const observer = new MutationObserver(checkForKSR);
    observer.observe(document.querySelector('footer'), { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12 w-full">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between px-6">
        
        {/* Logo and Description */}
        <div className="lg:w-1/3 mb-8 lg:mb-0">
          <img src={assets.logo} className="mb-6 w-40" alt="ReVastra Logo" />
          <p className="text-gray-400 text-sm leading-relaxed">
            ReVastra is your go-to destination for the latest fashion trends. Bringing style to everyone while ensuring sustainability in every stitch.
          </p>
        </div>

        {/* Quick Links */}
        <div className="lg:w-1/3 mb-8 lg:mb-0">
          <h3 className="font-semibold text-lg mb-4 text-gray-200">Quick Links</h3>
          <ul className="space-y-3 text-gray-300">
            <li><a href="/" className="hover:text-white transition duration-300">Home</a></li>
            <li><a href="/collection" className="hover:text-white transition duration-300">Collection</a></li>
            <li><a href="/about" className="hover:text-white transition duration-300">About Us</a></li>
            <li><a href="/contact" className="hover:text-white transition duration-300">Contact</a></li>
            <li><a href="/ourPolicy" className="hover:text-white transition duration-300">Our Policy</a></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="lg:w-1/3">
          <h3 className="font-semibold text-lg mb-4 text-gray-200">Contact Us</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-lg text-gray-400" />
              <a href="mailto:support@revastra.com" className="hover:text-white transition duration-300">support@revastra.com</a>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-lg text-gray-400" />
              <a href="tel:+1234567890" className="hover:text-white transition duration-300">+91 89689 78226</a>
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-lg text-gray-400" />
              <span>VIT Bhopal University</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 text-center text-gray-500 text-xs">
        <p>&copy; 2024 ReVastra. All rights reserved.</p>
      </div>

      {/* Centered KSR Integration */}
      <div className="mt-4 flex justify-center items-center text-gray-500 text-sm">
        <span>Created by <strong className="text-gray-300">KSR</strong></span>
      </div>
    </footer>
  );
}

export default Footer;
