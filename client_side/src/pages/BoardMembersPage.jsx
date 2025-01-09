import React from 'react'
import { useParams } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { FiSearch, FiUserPlus, FiUserMinus, FiUserCheck } from 'react-icons/fi';

const BoardMembersPage = () => {
    const { boardId } = useParams();

    return (
        <div className='container bg-bg-color'>
            <div className='lg:p-8 p-4'>
                <div className='flex space-x-3 mb-3 lg:mb-6 text-white items-center'>
                    <IoIosArrowBack className='lg:hidden' size={25}/>
                    <h1 className='text-2xl lg:text-3xl font-bold p-2 lg:p-0'>Board Members</h1>
                </div>

                {/* Search section */}
                <div className='p-6 bg-form-bg rounded-lg mb-8 shadow-lg'>
                    <div className='flex items-center justify-center space-x-4'>
                        <div className='flex-grow'>
                            <div className='relative'>
                                <input
                                    type='text'
                                    placeholder='Search by username...'
                                    className='w-full rounded-lg py-2 pl-10 text-white pr-4 bg-input-bg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                                <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
                            </div>
                        </div>
                        <button className='px-4 hidden md:flex lg:flex space-x-2 items-center transition duration-200 rounded-lg py-2 text-white text-sm bg-blue-600 hover:bg-blue-700'>
                            <FiUserPlus />
                            <span>Add member</span>
                        </button>
                    </div>
                    <button className='lg:hidden md:hidden mt-2 px-4 flex space-x-2 items-center transition duration-200 rounded-lg py-2 text-white text-sm bg-blue-600 hover:bg-blue-700'>
                        <FiUserPlus />
                        <span>Add member</span>
                    </button>

                    {/* Display members */}
                </div>
            </div>
        </div>
    )
}

export default BoardMembersPage;
