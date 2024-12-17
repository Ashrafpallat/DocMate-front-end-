import React from "react";
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-600 pb-6">
          {/* Logo & Description */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">DocMate</h2>
            <p className="text-sm text-gray-400 mt-2">
              Your ultimate healthcare management system.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 text-sm text-gray-400">
            <a href="/about" className="hover:text-white">
              About Us
            </a>
            <a href="/services" className="hover:text-white">
              Services
            </a>
            <a href="/contact" className="hover:text-white">
              Contact
            </a>
            <a href="/faq" className="hover:text-white">
              FAQ
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaLinkedinIn />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-400 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} DocMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
