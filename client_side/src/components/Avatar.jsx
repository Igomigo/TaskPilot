import React from 'react';
import { FaRegUser } from "react-icons/fa6";

const Avatar = ({ imageUrl, userId, username, width, height }) => {
    // Split the name to retrieve the initials
    const splitName = username?.split(" ") || [];
    //console.log(splitName);
    let name = "";

    if (splitName.length > 1) {
        // Use optional chaining to safely access array elements
        name = (splitName[0]?.[0] || "") + (splitName[1]?.[0] || "");
    } else if (splitName.length === 1) {
        name = splitName[0]?.[0] || "";
    }

    const bgColors = [
        "bg-indigo-500",
        "bg-orange-400",
        'bg-red-300',
        'bg-teal-300',
        "bg-sky-300",
        'bg-slate-400',
        'bg-gray-300',
        "bg-cyan-300",
        "bg-purple-500",
        'bg-pink-500',
        "bg-blue-300"
    ]

    // Generate a consistent index based on userId or name
    const hashCode = (str = "") => {
        return str.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    };

    const colorIndex = Math.abs(hashCode(userId || name || "default")) % bgColors.length;
    const bgColor = bgColors[colorIndex];

    const fontSize = Math.max(width * 0.4, 16);

    return (
        <div className={`flex justify-center overflow-hidden items-center rounded-full font-bold relative`} style={{width: width+"px", height: height+"px"}}>
            {
                imageUrl ? (
                    <img
                        src={`${imageUrl}`}
                        alt={username || "Avatar"}
                        className='w-full h-full object-cover'
                    />
                ) : (
                    username ? (
                        <div style={{fontSize: fontSize+"px", width: width+"px", height: height+"px"}} className={`overflow-hidden text-white flex justify-center items-center rounded-full text-lg ${bgColor}`}>
                            {name}
                        </div>
                    ) : (
                        <FaRegUser
                            size={width * 0.6}
                            className='text-gray-300'
                        />
                    )
                )
            }
        </div>
    )
}

export default Avatar;
