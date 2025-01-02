import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../components/Avatar';
import CreateBoard from '../components/CreateBoard';

const BoardsPage = () => {
  // Hooks
  const navigate = useNavigate();
  const user = useSelector(state => state?.user);
  const dispatch = useDispatch();
  const handleLogout = useLogout();

  // State Management
  const [boards, setBoards] = useState([]);
  const [members, setMembers] = useState([]);
  const [createBoard, setCreateBoard] = useState(false);

  // Update the boards from the create board component
  const updateBoardsFunction = (newBoard) => {
    setBoards(prev => (
      [
        newBoard,
        ...prev
      ]
    ));
  }

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
      //console.log(user);
      
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

        //console.log("Response:", response);

        if (!response.ok) {
          throw new Error("Error retrieving boards");
        }

        const boardsData = await response.json();
        //console.log("Boards Page response:", boardsData);

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
  }, [navigate, user, dispatch]);
  
  //console.log("Boards state:", boards);

  // Handle onClose event that closes the create group modal
  const handleOnclose = () => {
    setCreateBoard(false);
  }

  return (
    <main className='flex-1 relative mb-5 overflow-auto py-2 px-4'>
      <div className='mb-2 sticky z-30 bg-gray-900/70 backdrop-blur-md p-3 w-full rounded-md top-0 flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-slate-100'>Boards</h1>
        <button onClick={() => setCreateBoard(true)} className='lg:hidden flex rounded-md px-4 py-2 text-sm bg-blue-700 hover:bg-blue-800 font-medium items-center focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 p-3 text-slate-100 hover:text-white'>
          <FaPlus className='mr-2' size={20} />
          New Board
        </button>
        <button onClick={() => setCreateBoard(true)} className='hidden lg:flex rounded-md px-4 py-2 text-sm bg-blue-700 hover:bg-blue-800 font-medium items-center focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 p-3 text-slate-100 hover:text-white'>
          <FaPlus className='mr-2' size={20} />
          Create New Board
        </button>
      </div>
      {
        createBoard && (
          <CreateBoard updateBoards={updateBoardsFunction} user={user} onClose={handleOnclose} />
        )
      }
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
                <p className='text-gray-300 mb-5 text-sm'>{board?.description}</p>
                <div className='flex justify-between items-center'>
                  {
                    board?.members?.length > 0 ? (
                      <div className='flex'>
                        <div className='flex -space-x-2'>
                          {
                            board?.members?.slice(0, 3).map((member) => (
                                <Avatar key={member._id} username={member.username} imageUrl={member.profile_pic} width={30} height={30} />
                            ))
                          }
                        </div>
                        {
                          board?.members?.length > 3 && (
                            <span className='mt-3 text-sm text-white'>...</span>
                          )
                        }
                      </div>
                    ) : ("")
                  }
                  {
                    board?.lists?.length <= 1 ? (
                      <span className='text-gray-500 font-semibold'>{board.lists.length} List</span>
                    ) : (
                      <span className='text-gray-500 font-semibold'>{board.lists.length} Lists</span>
                    )
                  }
                </div>
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
