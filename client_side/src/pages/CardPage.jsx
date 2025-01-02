import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdClose, MdAccessTime } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa6";
import { AiOutlineAlignLeft } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { FiCheck } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const CardPage = () => {
    // Hooks
    const { listId, cardTitle } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state?.user);

    // State Management
    const [title, setTitle] = useState(cardTitle);
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([
        { id: 1, author: "John Doe", text: "Great progress on this task!", timestamp: "2023-06-15 10:30" },
        { id: 2, author: "Jane Smith", text: "I've added some resources to the shared folder.", timestamp: "2023-06-15 11:45" },
    ]);

    const handleCloseModal = () => {
        navigate(-1);
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            const newComment = {
                id: comments.length + 1,
                author: "Current User",
                text: comment,
                timestamp: new Date().toLocaleString(),
            };
            setComments([...comments, newComment]);
            setComment("");
        }
    };

    useEffect(() => {
        const url = `${import.meta.env.BACKEND_URL}/b/cards/${cardTitle}`;

        const getCardDetails = async () => {
            try {
                const token = user?.token;

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                console.log(response);

                if (!response.ok) {
                    throw new Error("Error retrieving card details");
                }

                const cardData = await response.json();
                console.log(cardData);

                setTitle(cardData.title);
                setDescription(cardData.description);
                setComments(cardData.comments);
                setDueDate(cardData.dueDate);
                setIsChecked(cardData.checked);

            } catch (error) {
                console.log("Error:", error.message);
            }
        }

        if (user) {
            getCardDetails();
        } else {
            console.log("User data not yet loaded");
        }
    }, [cardTitle]);

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center pt-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
                <div className="relative">
                    <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200">
                        <MdClose size={24} />
                    </button>
                    
                    <div className="p-6 space-y-6">
                        <div className="flex items-center space-x-3">
                            <FaRegCreditCard size={24} className="text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="flex-grow text-xl font-semibold bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
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

                        <div className='flex justify-between items-center'>
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

                            <div className="mt-4 mr-4 flex items-center space-x-3">
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
                                    <span className="ml-2 text-gray-300">Mark as Completed</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex w-full space-x-3">
                            <FaRegCommentAlt size={24} className="text-gray-400 flex-shrink-0 mt-1" />
                            <div className="flex-grow w-full">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Comments</h3>
                                <div className="bg-gray-700 w-full rounded-lg p-4 max-h-60 overflow-y-auto space-y-4">
                                    {comments.map((c) => (
                                        <div key={c.id} className="bg-gray-600 w-full rounded p-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium text-sm text-white">{c.author}</span>
                                                <span className="text-xs text-gray-400">{c.timestamp}</span>
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
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
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