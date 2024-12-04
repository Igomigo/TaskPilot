import React, { useEffect, useState } from 'react';
import { useNavigation, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { FaImage } from "react-icons/fa6";
import toast from 'react-hot-toast';
import uploadFile from '../helpers/UploadFile';
import { logout, setUser } from '../redux/userSlice';
import Loading from '../components/loading';

const ProfilePage = () => {
    //Hooks
    const params = useParams();
    const user = useSelector(state => state?.user);
    const dispatch = useDispatch();
    const navigate = useNavigation();

    useEffect(() => {
        setCredentials({
            username: user?.username,
            email: user?.email,
            profile_pic: user?.profile_pic
        });
    }, [user]);

    // State Management
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [credentials, setCredentials] = useState({
        username: user?.username,
        email: user?.email,
        profile_pic: user?.profile_pic
    });

    // Handle Input change
    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Handle Image Change
    const handleImageChange = async (e) => {
        setUploading(true);
        const file = e.target.files[0];

        const upload = await uploadFile(file);

        setCredentials(prev => ({
            ...prev,
            profile_pic: upload?.secure_url
        }));

        setUploading(false);
    }

    // Handle form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const url = `${import.meta.env.VITE_BACKEND_URL}/u/update`
        
        setLoading(true);
        try {
            const response = await fetch(url, {
                method: "PUT",
                body: JSON.stringify(credentials),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                dispatch(logout());
                navigate("/login");
                return;
            }

            if (response.status === 409) {
                toast.error("User with this email already exists, kindly enter a unique email");
                //console.log("User with this email already exists, kindly enter a unique email");
                return;
            }

            if (!response.ok) {
                throw new Error("Error while updating user data");
            }

            const data = await response.json();

            // Update the state
            dispatch(setUser(data));
            setCredentials({
                username: data?.username,
                email: data?.email,
                profile_pic: data?.profile_pic
            });
            toast.success("Your data has been updated");
            
        } catch (error) {
            console.error("Error:", error.message);
            toast.error(error.message || "An error occurred, please try again");

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-form-bg shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-10">
                    <h2 className="text-2xl font-semibold text-gray-300 text-center mb-6">Edit Your Profile</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <div className="rounded-full overflow-hidden">
                                    {
                                        uploading ? (
                                            <div className='bg-gray-900 flex items-center justify-center w-44 h-44'>
                                                <Loading />
                                            </div>
                                        ) : (
                                            <Avatar imageUrl={credentials?.profile_pic} width={200} height={200} username={params.username} />
                                        )
                                    }
                                </div>
                                {
                                    !uploading && (
                                        <label
                                            htmlFor="profile_pic"
                                            className="absolute bottom-2 right-1 bg-purple-600 text-white rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors"
                                        >
                                            <FaImage className="w-6 h-6" />
                                        </label>
                                    )
                                }
                                <input type="file" onChange={handleImageChange} name="profile_pic" id="profile_pic" className="sr-only" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={credentials?.username}
                                    onChange={handleInputChange}
                                    className="font-semibold w-full px-3 py-2 border text-gray-400 border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 bg-input-bg focus:ring-gray-500 focus:border-gray-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={credentials?.email}
                                    onChange={handleInputChange}
                                    className="font-semibold w-full px-3 py-2 border text-gray-400 border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 bg-input-bg focus:ring-gray-500 focus:border-gray-500"
                                />
                            </div>
                        </div>
                        <div className='flex justify-center items-center'>
                            <button
                                type="submit"
                                className="font-semibold bg-emerald-600 rounded-md hover:bg-emerald-700 text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                            >
                                {
                                    loading ? (<Loading />) : "Save Changes"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;
