import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';
import { formatDistanceToNow } from 'date-fns';

const BoardsPage = () => {
  // Hooks
  const navigate = useNavigate();
  const user = useSelector(state => state?.user);
  const dispatch = useDispatch();

  // State Management
  const [boards, setBoards] = useState([]);

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
          localStorage.removeItem("token");
          dispatch(logout());
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Error retrieving boards");
        }

        const boardsData = await response.json();
        console.log("Boards response:", boardsData);

        // Convert the updatedAt time to relative format
        const transformedBoards = boardsData?.map((board) => ({
          ...board,
          updatedAt: formatDistanceToNow(new Date(board.updatedAt), { addSuffix: true })
        }));

        setBoards(transformedBoards);

      } catch (error) {
        console.log("Error:", error);
      }
    }

    getBoards();
  }, [navigate, user]);
  
  console.log("Boards state:", boards);
  
  
  const Boards = [
    {
      updatedAt: "Updated 2h ago",
      title: "Project 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ornare nulla in tortor pharetra, at pulvinar lorem molestie.",
      status: "In Progress",
      _id: 1
    },
    {
      updatedAt: "Updated 2h ago",
      title: "Project 2",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ornare nulla in tortor pharetra, at pulvinar lorem molestie.",
      status: "Completed",
      _id: 2
    },
    {
      updatedAt: "Updated 2h ago",
      title: "Project 3",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ornare nulla in tortor pharetra, at pulvinar lorem molestie.",
      status: "In Progress",
      _id: 3
    },
    {
      updatedAt: "Updated 2h ago",
      title: "Project 4",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ornare nulla in tortor pharetra, at pulvinar lorem molestie.",
      status: "In Progress",
      _id: 4
    },
    {
      updatedAt: "Updated 2h ago",
      title: "Project 5",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ornare nulla in tortor pharetra, at pulvinar lorem molestie.",
      status: "In Progress",
      _id: 5
    },
    {
      updatedAt: "Updated 2h ago",
      title: "Project 6",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ornare nulla in tortor pharetra, at pulvinar lorem molestie.",
      status: "Completed",
      _id: 6
    }
  ]

  return (
    <main className='flex-1 overflow-auto p-4'>
      <div className='mb-6 flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-slate-100'>Boards</h1>
        <button className='lg:hidden flex rounded-md px-4 py-2 text-sm bg-blue-700 hover:bg-blue-800 font-medium items-center focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 p-3 text-slate-100 hover:text-white'>
          <FaPlus className='mr-2' size={20} />
          New Board
        </button>
        <button className='hidden lg:flex rounded-md px-4 py-2 text-sm bg-blue-700 hover:bg-blue-800 font-medium items-center focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 p-3 text-slate-100 hover:text-white'>
          <FaPlus className='mr-2' size={20} />
          Create New Board
        </button>
      </div>
      {/** show all boards */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {
          boards?.map(board => (
              <Link to={`boards/${board?._id}`} key={board?._id} className='group relative overflow-hidden rounded-lg bg-form-bg p-6 shadow-md shadow-gray-800 hover:shadow-gray-800 transition-all hover:shadow-lg'>
                <div className='mb-4 flex justify-between items-center'>
                  <span className={`text-xs rounded-full px-3 py-1 text-white font-semibold ${board?.status === "Completed" ? "bg-emerald-800" : "bg-input-bg"}`}>{board?.status}</span>
                  <span className='text-sm text-gray-500'>{board?.updatedAt}</span>
                </div>
                <h3 className='text-lg mb-2 font-semibold text-white text-ellipsis line-clamp-1'>{board?.title}</h3>
                <p className='text-gray-300 mb-4 text-sm'>{board?.description}</p>
                <div className='absolute inset-x-0 bottom-0 h-1 group-hover:bg-slate-400 bg-slate-500 transition-all ease-in-out duration-300 group-hover:h-1.5'></div>
              </Link>
            )
          )
        }
      </div>
    </main>
  )
}

export default BoardsPage;
