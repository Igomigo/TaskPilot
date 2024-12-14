import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiActivity, FiPlus, FiEdit, FiTrash2, FiMove } from 'react-icons/fi';

const ActivityLogPage = () => {
  // State Management
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hooks
  const user = useSelector(state => state?.user);
  const navigate = useNavigate();

  const fetchActivityLogs = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/b/activity-log`;

    const token = user?.token;

    if (!token) {
      console.warn("No token available; redirecting to login.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token is invalid or expired, redirect to login
        toast.error("Session expired, redirecting to login");
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("An Unknown error occurred");
      }

      const logs = await response.json();

      setLogs(logs);

    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to fetch activity logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.token) {
      fetchActivityLogs();
    } else {
      console.error("User token not available yet");
    }
  }, [user]);

  const getActionIcon = (action) => {
    switch (action) {
      case 'create':
        return <FiPlus className="text-green-500" />;
      case 'update':
        return <FiEdit className="text-blue-500" />;
      case 'delete':
        return <FiTrash2 className="text-red-500" />;
      case 'move':
        return <FiMove className="text-yellow-500" />;
      default:
        return <FiActivity className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Activity Log</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {logs.map((log) => (
              <li key={log._id} className="p-4 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {log.details}
                    </p>
                    <p className="text-sm text-gray-500">
                      {log.entity} - {log.action}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-400">
                    {formatDate(log.createdAt)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ActivityLogPage;