import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdClose, MdAccessTime } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa6";
import { AiOutlineAlignLeft } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { FiCheck } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import useLogout from '../hooks/useLogout';
import { format, parseISO, formatISO } from 'date-fns';

const CardPage = () => {
    // Hooks
    const { listId, cardTitle } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state?.user);
    const handleLogout = useLogout();

    // State Management
    const [cardData, setCardData] = useState({});
    const [title, setTitle] = useState(cardTitle);
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [saveLoading, setSaveLoading] = useState(false);

    const handleCloseModal = () => {
        navigate(-1);
    };

    const handleAddComment = (e) => {
        // e.preventDefault();
        // if (comment.trim()) {
        //     const newComment = {
        //         id: comments.length + 1,
        //         author: "Current User",
        //         text: comment,
        //         timestamp: new Date().toLocaleString(),
        //     };
        //     setComments([...comments, newComment]);
        //     setComment("");
        // }
    };

    // Handle submit form
    const handleSubmit = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/b/${cardData._id}/update`;

        // Convert date back to original format
        const dateObject = parseISO(dueDate); // Converts to Date object
        const originalFormat = formatISO(dateObject); // Converts to ISO 8601 format

        const updatedCardData = {
            title,
            description,
            dueDate: originalFormat,
            checked: isChecked
        }

        setSaveLoading(true);

        try {
            const response = await fetch(url, {
                method: "PUT",
                body: JSON.stringify(updatedCardData),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                }
            });

            if (response.status === 401) {
                handleLogout();
            }

            if (!response.ok) {
                throw new Error("Error updating card data");
            }

            const returnedCardData = await response.json();

            // Format the date to the required format
            const formattedDate = format(new Date(returnedCardData.dueDate), 'yyyy-MM-dd');

            setTitle(returnedCardData.title);
            setDescription(returnedCardData.description);
            setIsChecked(returnedCardData.checked);
            setDueDate(formattedDate);

        } catch (error) {
            console.log("Error:", error.message);

        } finally {
            setSaveLoading(false);
        }
    }

    useEffect(() => {
        const getCardDetails = async () => {
            if (!user.token) {
                console.log("User token not yet available");
                return;
            }

            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/b/cards/${cardTitle}`;
                const token = user?.token;

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                //console.log(response);
                if (response.status === 401) {
                    handleLogout();
                }

                if (!response.ok) {
                    throw new Error("Error retrieving card details");
                }

                const cardData = await response.json();
                console.log(cardData);

                // Format the date to the required format
                const formattedDate = format(new Date(cardData.dueDate), 'yyyy-MM-dd');

                setCardData(cardData);
                setTitle(cardData.title);
                setDescription(cardData.description);
                setComments(cardData.comments);
                setDueDate(formattedDate);
                setIsChecked(cardData.checked);

            } catch (error) {
                console.log("Error:", error.message);
            }
        }
        
        getCardDetails();

    }, [cardTitle, user]);

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center pt-10 px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
                <button onClick={handleCloseModal} className="absolute top-3 right-4 text-gray-400 hover:text-white transition-colors duration-200">
                    <MdClose size={24} />
                </button>
                <div className="mt-4">
                    <div className="p-6 space-y-6">
                        <div className="flex items-center space-x-3">
                            <FaRegCreditCard size={24} className="text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-xl font-semibold bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                                placeholder="Card Title"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <AiOutlineAlignLeft size={24} className="text-gray-400 flex-shrink-0 mt-1" />
                            <div className="flex-grow">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full text-sm bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add a more detailed description..."
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className='flex flex-col lg:justify-between md:justify-between lg:flex-row md:flex-row items-start lg:items-center md:items-center'>
                            <div className="flex items-center space-x-3">
                                <MdAccessTime size={24} className="text-gray-400 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-2">Due Date</h3>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="bg-gray-700 text-white rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 mr-4 flex items-center space-x-3">
                                <label htmlFor="custom-checkbox" className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            id="custom-checkbox"
                                            className="sr-only"
                                            checked={isChecked}
                                            onChange={() => setIsChecked(!isChecked)}
                                        />
                                        <div className={`w-6 h-6 border-2 rounded-md transition-colors duration-200 ease-in-out ${
                                            isChecked ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                                        }`}>
                                            {isChecked && (
                                            <FiCheck className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                            )}
                                        </div>
                                    </div>
                                    <span className="ml-3 text-sm text-gray-300">Mark as Completed</span>
                                </label>
                            </div>
                        </div>

                        <div className='flex justify-center items-center'>
                            <button onClick={handleSubmit} className='text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-xs lg:text-sm md:text-sm rounded-lg px-4 py-2'>
                                {
                                    saveLoading ? "Saving..." : "Save Changes"
                                }
                            </button>
                        </div>

                        <div className="flex w-full space-x-3">
                            <FaRegCommentAlt size={24} className="text-gray-400 flex-shrink-0 mt-1" />
                            <div className="flex-grow w-full">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Comments</h3>
                                <div className={`${comments.length > 0 ? "bg-gray-700 w-full rounded-lg p-4 max-h-60 overflow-y-auto space-y-4" : ""}`}>
                                    {comments.map((c) => (
                                        <div key={c._id} className="bg-gray-600 w-full rounded p-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium text-sm text-white">{c.createdBy.username}</span>
                                                <span className="text-xs text-gray-400">{c.updatedAt}</span>
                                            </div>
                                            <p className="text-sm text-gray-300">{c.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleAddComment} className="mt-4 w-full">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full text-sm bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Add a comment..."
                                        rows={2}
                                    />
                                    <button
                                        type="submit"
                                        className="mt-2 px-4 py-2 text-xs lg:text-sm md:text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Add Comment
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardPage;