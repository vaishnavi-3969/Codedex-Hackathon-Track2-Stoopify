import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-2 md:mb-0">
          <p className="text-sm font-normal">&copy; 2024 Stoopify. All rights reserved.</p>
          <p className="text-sm font-normal">Made with <FaHeart className="text-red-500 inline-block" /> for Codedex Hackathon</p>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-8">
          <Link to="/" className="text-sm text-gray-400 hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/" className="text-sm text-gray-400 hover:text-white">
            Terms of Service
          </Link>
          <Link to="/" className="text-sm text-gray-400 hover:text-white">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;