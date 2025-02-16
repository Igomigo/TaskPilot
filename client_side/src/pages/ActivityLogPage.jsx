import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiActivity, FiPlus, FiEdit, FiTrash2, FiMove } from 'react-icons/fi';
import { useRef } from 'react';
import useLogout from '../hooks/useLogout';
import Loading from '../components/loading';

const ActivityLogPage = () => {
  // // Hooks
  // const observer = useRef(null);
  // const scrollRef = useRef(null);
  // const handleLogout = useLogout();
  // const user = useSelector(state => state?.user);
  // const navigate = useNavigate();

  // // State Management
  // const [logs, setLogs] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);

  // // Infinite scrolling with the observer API
  // const lastActivityRef = (node) => {
  //   // Remove any existing observer
  //   if (observer.current) observer.current.disconnect();

  //   // Create a new observer, an instance of the intersection observer API
  //   observer.current = new IntersectionObserver(entries => {
  //     if (entries[0].isIntersecting && hasMore) {
  //       setPage(prev => prev + 1);
  //     }
  //   });

  //   // Observe the last activity log for when it comes into the viewport
  //   if (node) observer.current.observe(node);
  // } 

  // useEffect(() => {
  //   const fetchActivityLogs = async () => {
  //     if (!user.token || !hasMore) {
  //       return;
  //     }
  
  //     const url = `${import.meta.env.VITE_BACKEND_URL}/b/logs/activities?page=${page}&limit=10`;
  
  //     setLoading(true);
  
  //     try {
  //       const response = await fetch(url, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": `Bearer ${user.token}`
  //         }
  //       });
  
  //       if (response.status === 401) {
  //         // Token is invalid or expired, redirect to login
  //         toast.error("Session expired, redirecting to login");
  //         handleLogout();
  //       }
  
  //       if (!response.ok) {
  //         console.log(await response.json());
  //         throw new Error("An Unknown error occurred");
  //       }
  
  //       const activityLogsData = await response.json();
  
  //       setLogs(prev => {
  //         const newActivities = [...prev,  ...activityLogsData.activityLogs];

  //         // Maintain scroll position
  //         setTimeout(() => {
  //           if (scrollRef.current) {
  //             const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
  //             // Define a threshold to consider the user "at the bottom"
  //             const threshold = 50; // pixels
  //             const isAtBottom = scrollHeight - scrollTop - clientHeight < threshold;
        
  //             // Only auto-scroll if the user is already near the bottom
  //             if (isAtBottom) {
  //               scrollRef.current.scrollTop = scrollHeight - clientHeight;
  //             }
  //           }
  //         }, 0);

  //         return newActivities;
  //       });

  //       setHasMore(activityLogsData.hasMore);
  
  //     } catch (error) {
  //       console.error("Error:", error);
  //       toast.error("Failed to fetch activity logs");
  
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchActivityLogs();
  // }, [page, user]);

  // const getActionIcon = (action) => {
  //   switch (action) {
  //     case 'create':
  //       return <FiPlus className="text-green-500" />;
  //     case 'update':
  //       return <FiEdit className="text-blue-500" />;
  //     case 'delete':
  //       return <FiTrash2 className="text-red-500" />;
  //     case 'move':
  //       return <FiMove className="text-yellow-500" />;
  //     default:
  //       return <FiActivity className="text-gray-500" />;
  //   }
  // };

  // const formatDate = (dateString) => {
  //   const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  // return (
  //   <div ref={scrollRef} className="container mx-auto px-4 py-8 overflow-y-auto scroll">
  //     <h1 className="text-3xl font-bold mb-6 text-white">Activity Log</h1>
  //     {loading ? (
  //       <Loading />
  //     ) : (
  //       <div className="bg-white shadow-md rounded-lg">
  //         <ul className="divide-y divide-gray-200">
  //           {logs?.map((log, index) => (
  //             <li key={log._id} ref={index === logs.length - 1 ? lastActivityRef : null} className="p-4 hover:bg-gray-50 transition duration-150 ease-in-out">
  //               <div className="flex items-center space-x-4">
  //                 <div className="flex-shrink-0">
  //                   {getActionIcon(log.action)}
  //                 </div>
  //                 <div className="flex-1 min-w-0">
  //                   <p className="text-sm font-medium text-gray-900 truncate">
  //                     {log.details}
  //                   </p>
  //                   <p className="text-sm text-gray-500">
  //                     {log.entity} - {log.action}
  //                   </p>
  //                 </div>
  //                 <div className="flex-shrink-0 text-sm text-gray-400">
  //                   {formatDate(log.createdAt)}
  //                 </div>
  //               </div>
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     )}
  //   </div>
  // )
  return (
    <div className='text-center text-gray-400 pt-2'>Activity Log Page, still under construction</div>
  )
}

export default ActivityLogPage;