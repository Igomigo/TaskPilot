import React, { useEffect } from 'react'
import './App.css'
import toast, { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { MdError } from "react-icons/md";

const App = () => {
  // State Management
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Function to update offLine status
    const handleNetworkChange = () => {
      if (!navigator.onLine) {
        setIsOffline(true);
      } else {
        setIsOffline(false);
      }
    }

    // Check initial network status
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    // Listen for online/offline network events
    window.addEventListener("offline", handleNetworkChange);
    window.addEventListener("online", handleNetworkChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("offline", handleNetworkChange);
      window.removeEventListener("online", handleNetworkChange);
    };

  }, []);

  return (
    <>
      <Toaster />
      <main>
        <Outlet></Outlet>
      </main>
      {
        isOffline && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-center space-x-3 bg-red-50 p-4 border-b border-red-100">
                <MdError className="text-red-500 flex-shrink-0" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Network Connection Error</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-center">
                  Please check your internet connection. We can't load this page right now.
                </p>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default App;
