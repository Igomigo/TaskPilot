import React, { useState } from 'react'
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BoardsContent from '../components/BoardsContent';

const BoardsPage = () => {
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
        <BoardsContent />
      </div>
    </div>
  )
}

export default BoardsPage;
