import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Loading from './loading';
import { formatDistanceToNow } from 'date-fns';
import useLogout from '../hooks/useLogout';

const CreateBoard = ({ onClose, user, updateBoards }) => {
  // Hooks
  const handleLogout = useLogout();

  // State Management
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = `${import.meta.env.VITE_BACKEND_URL}/b/create`;

    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({title, description}),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        }
      });

      if (response.status === 401) {
        handleLogout();
      }
      
      if (response?.status === 400) {
        toast.error("Title and description must be provided");
        return;
      }

      if (!response?.ok) {
        throw new Error("An error occured");
      }

      const data = await response.json();

      // Convert the updatedAt time to the relative format
      const updatedData = {
        ...data,
        updatedAt: formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true })
      }

      toast.success('New board created successfully');
      console.log(updatedData);
      updateBoards(updatedData);
      setTitle('');
      setDescription('');
      onClose();

    } catch (error) {
      console.log("Error:", error.message);
      toast.error(error.message || "An unexpected error occured");

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 px-3 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-300">Create a New Board</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 px-4 text-sm py-3 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter board title"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 px-4 py-3 text-sm block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter board description"
              rows="3"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm font-semibold px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {
                loading ? (
                  <Loading />
                ) : (
                  "Create Board"
                )
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBoard;
