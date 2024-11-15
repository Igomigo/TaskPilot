import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import Loading from '../components/loading';
import { IoCloseSharp } from "react-icons/io5";
import uploadFile from '../helpers/UploadFile';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [uploadedPhoto, setUploadedPhoto] = useState("");
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: "",
        profile_pic: ""
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const url = `${import.meta.env.VITE_BACKEND_URL}/auth/register`;
        
        try {
            setLoading(true);
            const response = await axios.post(url, credentials);
            if (response?.data?.status) {
                console.log(response);
                toast.success(response?.data?.message);
                setCredentials({
                    username: "",
                    email: "",
                    password: "",
                    profile_pic: ""
                });
                setLoading(false);
                navigate("/login");
            }

        } catch (error) {
            setLoading(false);
            console.log("Error Block:", error?.response);
            toast.error(error?.response?.data?.error || "An unexpected error occurred");
        }
    
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        setIsUploading(true);
        const upload = await uploadFile(file);
        setIsUploading(false);

        console.log("Uploaded photo:", upload?.secure_url);

        setCredentials((prev) => {
            return {
                ...prev,
                profile_pic: upload?.secure_url
            }
        });

        setUploadedPhoto(file);
    }

    const handleClearUploadPhoto = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setUploadedPhoto("");
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-color">
            <div className="w-full max-w-sm space-y-6 m-2 p-6 bg-form-bg border border-gray-700 rounded-lg shadow-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl text-white font-semibold tracking-tight">
                        Welcome to <span className="font-bold text-yellow">Task</span>
                        <span className="font-bold text-green">Pilot</span>
                    </h1>
                    <p className="text-sm text-gray-400">Create your account to get started</p>
                </div>
                <form onSubmit={handleOnSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-400">
                        Name
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            required
                            onChange={handleOnChange}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-input-bg text-white placeholder-gray-400 focus:outline-none focus:ring-green focus:border-green"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                        Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name='email'
                            placeholder="Enter your email"
                            required
                            onChange={handleOnChange}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-input-bg text-white placeholder-gray-400 focus:outline-none focus:ring-green focus:border-green"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                        Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name='password'
                            placeholder="Enter your password"
                            required
                            onChange={handleOnChange}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-input-bg text-white placeholder-gray-400 focus:outline-none focus:ring-green focus:border-green"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="profile_pic" className="block text-sm font-medium text-gray-400">
                            <div className='w-full text-yellow hover:border border-green rounded h-14 flex gap-1 justify-center items-center px-3 bg-gray-700'>
                                <p className='text-sm max-w-[300] text-ellipsis line-clamp-1'>
                                    {
                                        uploadedPhoto?.name ? uploadedPhoto?.name : !isUploading && "Upload profile photo"
                                    }
                                    {
                                        isUploading && (
                                            <Loading />
                                        )
                                    }
                                </p>
                                {
                                    uploadedPhoto?.name && ( 
                                        <button onClick={handleClearUploadPhoto} type='button' className='hover:text-red-500 px-1' title='cancel upload'>
                                            <IoCloseSharp size={20}/>
                                        </button>
                                    )
                                }
                            </div>
                        </label>
                        <input
                            hidden
                            id="profile_pic"
                            type="file"
                            name='profile_pic'
                            onChange={handleImageUpload}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-input-bg text-white placeholder-gray-400 focus:outline-none focus:ring-green focus:border-green"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green"
                    >
                        {
                            loading ? <Loading /> : "Register"
                        }
                    </button>
                    <div className='text-sm text-center'>
                        <span className='text-gray-400'>Already have an account? </span>
                        <Link to={"/login"} className='text-green hover:text-emerald-700'>login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage;