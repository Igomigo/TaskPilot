import React from 'react';
import { FaPlus } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const BoardsPage = () => {
  const boards = [
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
