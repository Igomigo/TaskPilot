import React, { useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import { Link, useLocation } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";

const Sidebar = ({ showSidebar, toggleSidebar }) => {
    const { pathname } = useLocation();

    const boards = [
        {name: "Software Team plan", id: "1"},
        {name: "Content Team", id: "2"},
        {name: "Team Progress, Marketing", id: "3"},
        {name: "NNPC Engineers plan", id: "4"},
        {name: "Collaborapay Frontend Plan", id: "5"}
    ]

    return (
        <aside className={
            `${showSidebar ? 
                "translate-x-0" : "-translate-x-full"
            } bg-form-bg h-screen w-64 py-4 px-2 fixed left-0 z-50 inset-y-0 transition-transform duration-300 shadow-lg ease-in-out lg:relative lg:translate-x-0`}>
            <div className='flex justify-between mb-4 px-2'>
                <h1 className='text-2xl font-bold'><span className='text-yellow'>Task</span><span className='text-green'>Pilot</span></h1>
                <button onClick={toggleSidebar} className='lg:hidden text-white'>
                    <IoCloseSharp size={30} />
                </button>
            </div>
            {/** Navigation links */}
            <nav className='flex-1 space-y-1 px-2 py-5'>
                <Link to={"/"} className={
                    `${pathname === "/" && "bg-input-bg"} hover:bg-slate-600 p-2 text-slate-100 rounded-lg px-4 py-2 flex items-center`
                }>
                    <MdSpaceDashboard className='mr-4 text-slate-100' size={22}/>
                    Boards
                </Link>

                <div className={
                    `p-2 rounded-lg px-4 py-2 flex text-gray-300 items-center justify-between`
                }>
                    Your boards
                    <FaPlus title='create new board' className=' text-gray-300 hover:bg-slate-600 p-2 rounded-full' size={35}/>
                </div>
                {/** List of last 4 boards */}
                <div className='ml-7 flex flex-col'>
                    {
                        boards.length > 0 ? boards.map((board) => {
                            return <Link key={board.id} to={`/boards/${board.id}`} className='mb-1 px-2 py-1 rounded-lg hover:bg-input-bg'>
                                <p className='text-sm text-gray-400 text-ellipsis line-clamp-1 hover:text-white'>{board.name}</p>
                            </Link>
                        }) : <p className='text-sm text-gray-500'>None yet</p>
                    }
                </div>

                <Link to={"/settings"} className={
                    `${pathname === "/settings" && "bg-input-bg"} hover:bg-slate-600 p-2 text-slate-100 rounded-lg px-4 py-2 flex items-center`
                }>
                    <IoSettingsSharp className='mr-4 text-slate-100' size={22}/>
                    Settings
                </Link>
            </nav>
        </aside>
    )
}

export default Sidebar;
