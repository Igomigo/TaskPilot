// import React, { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { MdClose, MdAccessTime, MdLabel } from "react-icons/md";
// import { FaRegCreditCard } from "react-icons/fa6";
// import { AiOutlineAlignLeft } from "react-icons/ai";
// import { BsCheckSquare } from "react-icons/bs";

// const CardPage = () => {
//     const { listId, cardTitle } = useParams();
//     const navigate = useNavigate();

//     const [title, setTitle] = useState(cardTitle);
//     const [description, setDescription] = useState("");
//     const [dueDate, setDueDate] = useState("");

//     const handleCloseModal = () => {
//         navigate(-1);
//     };

//     return (
//         <div className='fixed z-50 inset-0 p-3 bg-black bg-opacity-50 overflow-y-auto'>
//             <div className='max-w-2xl relative p-6 mt-12 rounded-lg mx-auto bg-gray-800 text-gray-300 shadow-xl'>
//                 <button onClick={handleCloseModal} className='absolute top-2 right-2 hover:text-white text-gray-400 transition-colors duration-200'>
//                     <MdClose size={24} />
//                 </button>
                
//                 <div className='flex items-center mb-6'>
//                     <FaRegCreditCard size={24} className="text-gray-400" />
//                     <input
//                         type='text'
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         className='ml-3 font-semibold text-xl bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full px-2 py-1'
//                         placeholder="Card Title"
//                     />
//                 </div>

//                 <div className='flex mb-6'>
//                     <AiOutlineAlignLeft size={24} className="text-gray-400 mt-1 flex-shrink-0" />
//                     <div className='ml-3 w-full'>
//                         <h3 className='text-sm font-medium mb-2 text-gray-400'>Description</h3>
//                         <textarea
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             className='w-full text-sm bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
//                             placeholder='Add a more detailed description...'
//                             rows={4}
//                         />
//                     </div>
//                 </div>

//                 <div className='flex mb-6'>
//                     <MdAccessTime size={24} className="text-gray-400 mt-1 flex-shrink-0" />
//                     <div className='ml-3'>
//                         <h3 className='text-sm font-medium mb-2 text-gray-400'>Due Date</h3>
//                         <input
//                             type="date"
//                             value={dueDate}
//                             onChange={(e) => setDueDate(e.target.value)}
//                             className='bg-gray-700 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
//                         />
//                     </div>
//                 </div>

//                 <div className='flex mb-6'>
//                     <BsCheckSquare size={24} className="text-gray-400 mt-1 flex-shrink-0" />
//                     <div className='ml-3 w-full'>
//                         <h3 className='text-sm font-medium mb-2 text-gray-400'>Checklist</h3>
//                         <button className='bg-gray-700 hover:bg-gray-600 text-sm rounded px-3 py-1 transition-colors duration-200'>
//                             Add Checklist Item
//                         </button>
//                     </div>
//                 </div>

//                 <div className='flex'>
//                     <MdLabel size={24} className="text-gray-400 mt-1 flex-shrink-0" />
//                     <div className='ml-3 w-full'>
//                         <h3 className='text-sm font-medium mb-2 text-gray-400'>Labels</h3>
//                         <div className='flex flex-wrap gap-2'>
//                             <span className='bg-blue-500 rounded-full w-8 h-8'></span>
//                             <span className='bg-green-500 rounded-full w-8 h-8'></span>
//                             <span className='bg-yellow-500 rounded-full w-8 h-8'></span>
//                             <button className='bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200'>
//                                 +
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CardPage;

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdClose, MdAccessTime } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa6";
import { AiOutlineAlignLeft } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";

const CardPage = () => {
    const { listId, cardTitle } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState(cardTitle);
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
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

                        <div className="flex space-x-3">
                            <FaRegCommentAlt size={24} className="text-gray-400 flex-shrink-0 mt-1" />
                            <div className="flex-grow">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Comments</h3>
                                <div className="bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto space-y-4">
                                    {comments.map((c) => (
                                        <div key={c.id} className="bg-gray-600 rounded p-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium text-sm text-white">{c.author}</span>
                                                <span className="text-xs text-gray-400">{c.timestamp}</span>
                                            </div>
                                            <p className="text-sm text-gray-300">{c.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleAddComment} className="mt-4">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full text-sm bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Write a comment..."
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