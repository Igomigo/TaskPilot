import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef(null);

  // Toggle the sidebar state directly
  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  }

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
        <Sidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      
      {/** Overlay for smaller screens */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setShowSidebar(false)}
        ></div>
      )}
      
      {/** Main content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/** Top bar */}
        <Topbar toggleSidebar={toggleSidebar} />
        {/** Page Content */}
        <Outlet />
      </div>
    </div>
  )
}

export default Layout;