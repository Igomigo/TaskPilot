import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'

const RegisterPage = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: ""
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

    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log(credentials);
        toast.success("Submit button clicked");
        console.log("")
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
                        id="email"
                        type="email"
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
                    <button
                        onClick={handleOnSubmit}
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green"
                    >
                        Register
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