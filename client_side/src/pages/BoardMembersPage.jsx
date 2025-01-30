import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { FiSearch, FiUserPlus, FiUserMinus, FiUserCheck } from 'react-icons/fi';
import Avatar from '../components/Avatar';
import { useSelector } from 'react-redux';
import Loading from '../components/loading';
import useLogout from '../hooks/useLogout';
import toast from 'react-hot-toast';

const BoardMembersPage = () => {
    // Hooks
    const { boardId } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state?.user);
    const logout = useLogout();

    // State Management
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(true);
    const [addMemberLoading, setAddMemberLoading] = useState(false);
    const [username, setUsername] = useState("");

    // Navigate the user to the previous route
    const navigateBack = () => {
        navigate(-1);
    }

    // Add a new member to the board
    const addMember = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/b/${boardId}/add-member`;

        if (!username || username === "") {
            return;
        }

        setAddMemberLoading(true);

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({username}),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                }
            });

            if (response.status === 401) {
                logout();
            }

            if (response.status === 409) {
                toast.success(`${username} is already a member of this board`);
            }

            if (!response.ok) {
                throw new Error("Error adding a new member to the board");
            }

            const newMember = await response.json();

            // Update state
            setUsername("");

            setMembers(prev => {
                const updatedMembersArray = [...prev];
                return [...updatedMembersArray, newMember];
            });

            toast.success(`${username} has been added to the board`);
            
        } catch (error) {
            console.log("Error:", error.message);
        } finally {
            setAddMemberLoading(false);
        }
    }

    // Remove member from board
    const removeMember = async (userId) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/b/${boardId}/${userId}`;

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                }
            });

            if (response.status === 401) {
                logout();
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
            }

            const responseData = await response.json();

            setMembers(prevMembers => 
                prevMembers.filter(member => member._id !== responseData.memberId)
            );

            toast.success(responseData.message);

        } catch (error) {
            console.log("Error:", error);
            toast.error("Failed to remove member from board");
        }
    }

    // Fetch board members data
    useEffect(() => {
        const getMembers = async () => {
            const url = `${import.meta.env.VITE_BACKEND_URL}/b/${boardId}/members`;

            const token = user?.token;

            if (!token) {
                return;
            }

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    toast.error("Session expired, please login to continue");
                    logout();
                }

                if (!response.ok) {
                    throw new Error("Error retrieving board members data");
                }

                const members = await response.json();
                console.log("Members:", members);

                // Update the members state
                setMembers(members);

            } catch (error) {
                console.log("An error occured:", error.message);

            } finally {
                setMembersLoading(false);
            }
        }

        getMembers();

    }, [user, boardId]);

    return (
        <div className='container overflow-auto bg-bg-color'>
            <div className='lg:p-8 p-4'>
                <div className='flex space-x-2 mb-4 lg:mb-4 text-white items-center'>
                    <button onClick={navigateBack} className='lg:hidden focus:text-blue-500'>
                        <IoIosArrowBack size={25}/>
                    </button>
                    <h1 className='text-2xl lg:text-3xl font-bold p-2 lg:p-0'>Board Members</h1>
                </div>

                {/* Search section */}
                <div className='sticky top-1 z-20 p-6 bg-form-bg rounded-lg mb-8 shadow-lg'>
                    <div className='flex items-center justify-center space-x-4'>
                        <div className='flex-grow'>
                            <div className='relative'>
                                <input
                                    type='text'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder='Search by username...'
                                    className='w-full rounded-lg py-2 pl-10 text-white pr-4 bg-input-bg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                                <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
                            </div>
                        </div>
                        <button onClick={addMember} className='px-4 hidden md:flex lg:flex space-x-2 items-center transition duration-200 rounded-lg py-2 text-white text-sm bg-blue-600 hover:bg-blue-700'>
                            <FiUserPlus />
                            <span>
                                {addMemberLoading ? "Adding..." : "Add member"}
                            </span>
                        </button>
                    </div>
                    <button onClick={addMember} className='lg:hidden md:hidden mt-2 px-4 flex space-x-2 items-center transition duration-200 rounded-lg py-2 text-white text-sm bg-blue-600 hover:bg-blue-700'>
                        <FiUserPlus />
                        <span>
                            {addMemberLoading ? "Adding..." : "Add member"}
                        </span>
                    </button>
                </div>

                {/* Display members */}
                {
                    membersLoading ? (
                        <div><Loading /></div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {members.length > 0 && (
                                members.map(member => (
                                    <div key={member._id} className='p-3 bg-form-bg shadow-lg rounded-lg'>
                                        <div className='flex justify-between'>
                                            <div className='flex items-center space-x-3'>
                                                {member?.user && (
                                                    <Avatar
                                                        imageUrl={member?.user?.profile_pic}
                                                        userId={member?.user?._id}
                                                        username={member?.user?.username}
                                                        width={50}
                                                        height={50}
                                                    />
                                                )}
                                                <div className='flex flex-col space-y-2'>
                                                    <h3 className='font-bold text-white'>{member?.user?.username}</h3>
                                                    <p className='text-gray-400 text-xs md:text-sm lg:text-sm'>{member?.user?.email}</p>
                                                    {member?.role === "admin" && (
                                                        <p className='text-white w-fit rounded-full bg-blue-600 px-2 py-1 text-xs'>Admin</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='flex space-x-2'>
                                                <button onClick={() => removeMember(member?.user?._id)} className="text-red-500 hover:text-red-600 p-2 h-fit w-fit rounded-full hover:bg-red-100 hover:bg-opacity-20 transition duration-200">
                                                    <FiUserMinus title='remove member' size={20} />
                                                </button>
                                                {member.role !== "admin" && (
                                                    <button className="text-green hover:text-emerald-600 p-2 h-fit w-fit rounded-full hover:bg-emerald-100 hover:bg-opacity-20 transition duration-200">
                                                        <FiUserCheck title='make admin' size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default BoardMembersPage;
