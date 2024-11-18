import React, { useState } from 'react'
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import MainContent from '../components/MainContent';

const HomePage = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  // Toggle the sidebar state directly
  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  }

  return (
    <div className='flex h-screen bg-bg-color'>
      {/** Side bar */}
      <Sidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
      {/** Main content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/** Top bar */}
        <Topbar toggleSidebar={toggleSidebar} />
        {/** Page Content */}
        <MainContent />
      </div>
    </div>
  )
}

export default HomePage;
