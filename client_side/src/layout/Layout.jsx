import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setToken, setUser } from '../redux/userSlice';
import useLogout from '../hooks/useLogout';

const Layout = () => {
  // Hooks
  const user = useSelector(state => state?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = useLogout();

  // State Management
  const [showSidebar, setShowSidebar] = useState(false);
  const [boards, setBoards] = useState([]);
  const sidebarRef = useRef(null);

  // Toggle the sidebar state directly
  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  }

  // Send request for the board data
  useEffect(() => {
    // Function that retrieves all boards data for the current user
    const getBoards = async () => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/b`;

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      //console.log("Token:", token);
      
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response?.status === 401) {
          // Token is invalid or expired, redirect to login
          handleLogout();
        }

        if (!response.ok) {
          throw new Error("Error retrieving boards");
        }

        const boardsData = await response.json();
        //console.log("Layout Boards response:", boardsData);
        setBoards(boardsData);

      } catch (error) {
        console.log("Error:", error);
      }
    }

    getBoards();
  }, [navigate, user, dispatch]);

  // Send a request for the user data
  useEffect(() => {
    const getUserData = async () => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/u/account`;

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          handleLogout();
        }

        if (!response.ok) {
          throw new Error("Error retrieving user details");
        }

        const userData = await response.json();

        //console.log("State Data before:", user);

        // Update the state data on the redux store
        dispatch(setUser(userData));
        dispatch(setToken(token));

        //console.log("State Data after:", user);

      } catch (error) {
        console.log("Error:", error.message);
      }
    }

    getUserData();
  }, [navigate, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSidebar && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSidebar]);

  return (
    <div className='relative flex h-screen bg-bg-color'>
      {/** Side bar */}
      <div ref={sidebarRef}>
        <Sidebar boards={boards} showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      
      {/** Overlay for smaller screens */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden" 
          onClick={() => setShowSidebar(false)}
        ></div>
      )}
      
      {/** Main content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/** Top bar */}
        <Topbar user={user} toggleSidebar={toggleSidebar} />
        {/** Page Content */}
        <Outlet />
      </div>
    </div>
  )
}

export default Layout;