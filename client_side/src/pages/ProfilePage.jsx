import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ProfileContent from '../components/ProfileContent';

const ProfilePage = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const params = useParams();

    useEffect(() => {
        console.log("Username:", params.username);
    }, []);

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
                <ProfileContent user={params.username} />
            </div>
        </div>
    )
}

export default ProfilePage;
