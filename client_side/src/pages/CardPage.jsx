import React from 'react';
import { Link, useNavigate, useNavigation, useParams } from 'react-router-dom';
import { MdClose } from "react-icons/md";

const CardPage = () => {
    // Hooks
    const {listId, cardTitle} = useParams();
    const navigate = useNavigate();
    console.log(listId);

    const handleCloseModal = () => {
        navigate(-1);
    }

    return (
        <div className='fixed z-50 inset-0 p-3 bg-black bg-opacity-50'>
            <div className='max-w-4xl relative p-3 mt-12 rounded-lg mx-auto bg-form-bg text-white'>
                <div>{cardTitle}</div>
                <div onClick={handleCloseModal} className='absolute top-0 right-0 hover:text-white px-3 py-2 text-gray-300'>
                    <MdClose size={30}/>
                </div>
            </div>
        </div>
    )
}

export default CardPage;
