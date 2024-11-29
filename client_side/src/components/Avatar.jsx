import React from 'react';
import { FaRegUser } from "react-icons/fa6";

const Avatar = ({ imageUrl, userId, username, width, height }) => {
    // Split the name to retrieve the initials
    const splitName = username?.split(" ");
    let name;
    if (splitName.length > 1) {
        name = splitName[0][0] + splitName[1][0];
    } else {
        name = splitName[0][0];
    }

    const bgColors = [
        'bg-slate-400',
        'bg-teal-300',
        'bg-red-300',
        'bg-green-300',
        'bg-yellow-300',
        'bg-gray-300',
        "bg-cyan-300",
        "bg-sky-300",
        "bg-blue-300"
    ]

    // Generate a consistent index based on userId or name
    const hashCode = (str = "") => {
        return str.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    };

    const colorIndex = Math.abs(hashCode(userId || name || "default")) % bgColors.length;
    const bgColor = bgColors[colorIndex];

    return (
        <div className={`rounded-full font-bold relative`} style={{width: width+"px", height: height+"px"}}>
            {
                imageUrl ? (
                    <img
                        src={`${imageUrl}`}
                        width={width}
                        height={height}
                        className='overflow-hidden rounded-full'
                    />
                ) : (
                    username ? (
                        <div className={`overflow-hidden flex justify-center items-center rounded-full text-lg ${bgColor}`} style={{width: width+"px", height: height+"px"}}>
                            {name}
                        </div>
                    ) : (
                        <FaRegUser
                            size={width}
                        />
                    )
                )
            }
        </div>
    )
}

export default Avatar;
