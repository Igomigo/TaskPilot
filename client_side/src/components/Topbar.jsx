import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Topbar = ({ toggleSidebar }) => {
    const [toggleArrow, setToggleArrow] = useState(true);
    const [showUserPopup, setShowUserPopup] = useState(false);
    const userPopupRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (userPopupRef.current && !userPopupRef.current.contains(event.target)) {
                setShowUserPopup(false);
                setToggleArrow(true);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Toggle between arrow down and arrow up
    const toggleArowFunction = () => {
        setToggleArrow(prev => !prev);
        setShowUserPopup(prev => !prev);
    }

    return (
        <header className='flex justify-between items-center border-b-input-bg shadow-lg bg-form-bg text-white lg:px-6 px-4 py-3'>
            <div className='flex justify-center items-center'>
                <button onClick={toggleSidebar} className='text-slate-100 focus:text-white lg:hidden mr-4'>
                    <HiOutlineMenuAlt2 size={23}/>
                </button>
                <div className='flex lg:w-80 max-w-md focus-within:border-white rounded-md justify-center items-center border border-input-bg px-1'>
                    <input
                        type='search'
                        placeholder='Search boards...'
                        className='p-2 bg-transparent w-full border-none text-sm focus:outline-none text-slate-100'
                    />
                    <IoIosSearch className='mr-1 text-slate-500' size={23}/>
                </div>
            </div>
            <div className='flex ml-4 space-x-4 justify-center items-center'>
                <button className=''>
                    <IoNotifications title='notification' className='text-slate-300 hover:text-white' size={22}/>
                </button>
                <div onClick={toggleArowFunction} ref={userPopupRef} className='relative'>
                    <button className='flex rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-slate-300 justify-center items-center space-x-2'>
                        <img src={""} className='w-8 h-8 rounded-full' />
                        <div className='text-slate-400 hidden lg:block'>
                            {
                                toggleArrow ? <IoIosArrowDown size={18} /> : <IoIosArrowUp size={18} />
                            }
                        </div>
                    </button>
                    {
                        showUserPopup && (
                            <div className='border border-slate-700 px-1 absolute right-0 mt-2 w-40 py-1 z-10 bg-form-bg shadow-lg rounded-md'>
                                <Link to={"profile/igomigo fatai"} className='flex w-full rounded-md items-center px-2 py-2 group hover:bg-input-bg hover:text-white text-slate-300 text-sm'>
                                    <FaUser size={13} className='text-slate-300 group-hover:text-white mr-2'/>
                                    <span className='text-ellipsis line-clamp-1'>Igomigo fatai Victor</span>
                                </Link>
                                <button className='flex w-full rounded-md items-center px-2 py-2 group hover:bg-input-bg hover:text-white text-slate-300 text-sm'>
                                    <FiLogOut size={13} className='text-slate-300 group-hover:text-white mr-2'/>
                                    Logout
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
        </header>
    )
}

export default Topbar;
