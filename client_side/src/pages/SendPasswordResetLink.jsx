import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../components/loading';
import toast from 'react-hot-toast';

const SendPasswordResetLink = () => {
    // Hooks
    const navigate = useNavigate();

    // State Management
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle onChange event
    const handleOnChange = (e) => {
        setEmail(e.target.value);
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const url = `${import.meta.env.VITE_BACKEND_URL}/u/send-reset-password-link`;
        
        setLoading(true);

        try {
            console.log("email:", email);
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("Response:", response);

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message);
                throw new Error(errorData.message);
            }

            const result = await response.json();
            toast.success(result.message || "Reset password link has been sent to your email");

        } catch (error) {
            console.log("Error:", error);

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-color">
            <div className="w-full max-w-sm space-y-6 m-2 p-6 bg-form-bg border border-gray-700 rounded-lg shadow-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl text-white font-semibold tracking-tight">
                        Welcome to <span className="font-bold text-yellow">Task</span>
                        <span className="font-bold text-green">Pilot</span>
                    </h1>
                    <p className="text-sm text-gray-400">kindly check your email for the reset link after you click the send reset link button</p>
                </div>
                <form onSubmit={handleOnSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                        Email
                        </label>
                        <input
                        id="email"
                        type="email"
                        name='email'
                        value={email}
                        placeholder="Enter your email"
                        required
                        onChange={handleOnChange}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-input-bg text-white placeholder-gray-400 focus:outline-none focus:ring-green focus:border-green"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green"
                    >
                        {
                            loading ? <Loading /> : "Send Reset Link"
                        }
                    </button>
                    <div className='text-sm text-center'>
                        <span className='text-gray-400'>Got here by mistake? </span>
                        <Link to={"/login"} className='text-green hover:text-emerald-700'>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SendPasswordResetLink;
