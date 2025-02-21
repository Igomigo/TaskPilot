import React, { useEffect } from 'react'
import './App.css'
import toast, { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { MdError } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import io from "socket.io-client";
import { setSocketConnection } from './redux/userSlice';
import useLogout from './hooks/useLogout';

const App = () => {
  // Hooks
  const dispatch = useDispatch();
  const user = useSelector(state => state?.user);
  const handleLogout = useLogout();

  // State Management
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Establish socket connection
  useEffect(() => {
    if (user && !user.socketConnection) {
      const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
        auth: {
          token: user?.token
        }
      });

      socketConnection.on("connect", () => {
        console.log("Socket connected");
        dispatch(setSocketConnection(socketConnection));
      });

      socketConnection.on("Auth_error", data => {
        toast.error("Session expired, kindly log in again");
        handleLogout();
      });
    }
    
  }, [user, dispatch, handleLogout]);

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
