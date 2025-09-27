/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaHeadset, FaExchangeAlt, FaTruck } from "react-icons/fa";

const UserFooter = () => {
  return (
    <footer className="py-12 mt-auto text-white bg-gray-900">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* About Us Section */}
          <div className="space-y-5">
            <h4 className="text-xl font-bold tracking-wide">About Us</h4>
            <p className="leading-relaxed text-gray-400">
              We offer the best odds! Explore our vast collection of items and enjoy great discounts.
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs">Customer Support</p>
                <p className="font-medium">+254708048110</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-xl font-bold tracking-wide">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="flex items-center space-x-2 transition-colors hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </a>
              </li>
            
              <li>
                <a href="#" className="flex items-center space-x-2 transition-colors hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>About</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 transition-colors hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service Section */}
          <div className="space-y-5">
            <h4 className="text-xl font-bold tracking-wide">Customer Service</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="flex items-center space-x-2 transition-colors hover:text-white">
                  <FaHeadset className="w-4 h-4" />
                  <span>Help & Support</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 transition-colors hover:text-white">
                  <FaExchangeAlt className="w-4 h-4" />
                  <span>Returns & Exchanges</span>
                </a>
              </li>
            
              <li>
                <a href="#" className="flex items-center space-x-2 transition-colors hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Privacy Policy</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-5">
            <h4 className="text-xl font-bold tracking-wide">Newsletter</h4>
            <p className="text-gray-400">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Button
                type="submit"
                className="transition-colors bg-blue-600 hover:bg-blue-700"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 mt-12 border-t border-gray-800">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Monster Tipsters. All rights reserved.
            </p>
            
        
            
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;