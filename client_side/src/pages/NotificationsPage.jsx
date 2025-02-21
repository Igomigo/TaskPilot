import React, { useEffect, useState } from 'react'
import { IoNotifications } from "react-icons/io5";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import Loading from "../components/loading";
import { useSelector } from 'react-redux';
import useLogout from '../hooks/useLogout';

const mockNotifications = [
  {
    userId: 1, // Replace with actual user ID
    message: "Your task is due tomorrow.",
    type: "Personal",
    seen: false,
    createdAt: "2025-02-15T09:00:00.000Z"
  },
  {
    userId: 2, // Replace with actual user ID
    message: "System maintenance scheduled for tonight.",
    type: "System",
    seen: false,
    createdAt: "2025-02-15T09:05:00.000Z"
  },
  {
    userId: 3, // Replace with actual user ID
    message: "You have been assigned a new task.",
    type: "Targeted",
    seen: true,
    createdAt: "2025-02-15T09:10:00.000Z"
  },
  {
    userId: 4, // Replace with actual user ID
    message: "Your profile has been updated.",
    type: "Personal",
    seen: false,
    createdAt: "2025-02-15T09:15:00.000Z"
  },
  {
    userId: 5, // Replace with actual user ID
    message: "New feature released: Task comments.",
    type: "System",
    seen: true,
    createdAt: "2025-02-15T09:20:00.000Z"
  },
  {
    userId: 6, // Replace with actual user ID
    message: "You have a meeting scheduled at 3 PM.",
    type: "Targeted",
    seen: false,
    createdAt: "2025-02-15T09:25:00.000Z"
  },
  {
    userId: 7, // Replace with actual user ID
    message: "Your password has been changed.",
    type: "Personal",
    seen: true,
    createdAt: "2025-02-15T09:30:00.000Z"
  },
  {
    userId: 8, // Replace with actual user ID
    message: "System update completed successfully.",
    type: "System",
    seen: false,
    createdAt: "2025-02-15T09:35:00.000Z"
  },
  {
    userId: 9, // Replace with actual user ID
    message: "You have been removed from the project.",
    type: "Targeted",
    seen: true,
    createdAt: "2025-02-15T09:40:00.000Z"
  },
  {
    userId: 10, // Replace with actual user ID
    message: "Your subscription is about to expire.",
    type: "Personal",
    seen: false,
    createdAt: "2025-02-15T09:45:00.000Z"
  },
  {
    userId: 11, // Replace with actual user ID
    message: "System downtime scheduled for maintenance.",
    type: "System",
    seen: true,
    createdAt: "2025-02-15T09:50:00.000Z"
  },
  {
    userId: 12, // Replace with actual user ID
    message: "You have a new message from the admin.",
    type: "Targeted",
    seen: false,
    createdAt: "2025-02-15T09:55:00.000Z"
  },
  {
    userId: 13, // Replace with actual user ID
    message: "Your account has been verified.",
    type: "Personal",
    seen: true,
    createdAt: "2025-02-15T10:00:00.000Z"
  },
  {
    userId: 14, // Replace with actual user ID
    message: "System performance improved.",
    type: "System",
    seen: false,
    createdAt: "2025-02-15T10:05:00.000Z"
  },
  {
    userId: 15, // Replace with actual user ID
    message: "You have been added to a new project.",
    type: "Targeted",
    seen: true,
    createdAt: "2025-02-15T10:10:00.000Z"
  }
];


const NotificationsPage = () => {
  // Hooks
  const user = useSelector(state => state?.user);
  const handleLogout = useLogout();

  // State Management
  const [notifications, setNotifications] = useState(mockNotifications);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotification = async () => {
      if (!user.token) {
        return;
      }

      const url = `${import.meta.env.VITE_BACKEND_URL}/${user?._id}/notifications`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          }
        });

        if (response.status === 401) {
          handleLogout();
        }

        if (!response.ok) {
          const errorData = await response.json();
          console.log("Error:", errorData.message);
          throw new Error(errorData.message || "An unexpected error occured");
        }

        const result = await response.json();

        setNotifications(result?.notifications);

        console.log(result);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotification();
  }, [user]);

  if (loading) return <p className='flex h-screen items-center justify-center'><Loading /></p>

  return (
    <div className='p-4 lg:p-6 md:p-6 overflow-auto scroll'>
      <div className='max-w-3xl'>
        <div className='flex space-x-2 items-center text-white'>
          <IoNotifications size={28}/>
          <h1 className='text-2xl lg:text-3xl font-semibold'>Notifications</h1>
        </div>
        <div className='mt-6 flex flex-col space-y-3'>
          {
            notifications.length > 0 ? (
                notifications?.map((notification) =>
                  <div key={notification._id} className='flex flex-col space-y-2 bg-form-bg py-4 px-6 rounded-lg'>
                    <h3 className='text-lg font-medium text-blue-600'>{notification.type}</h3>
                    <p className='text-sm text-gray-300'>{notification.message}</p>
                    <p className='text-xs text-gray-500'>{formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}</p>
                  </div>
                )
            ) : (
              <p className='text-sm text-center text-gray-400'>No notifications yet</p>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage;
