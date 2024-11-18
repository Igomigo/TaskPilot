import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
    const params = useParams();

    useEffect(() => {
        console.log("Username:", params.username);
    }, []);

    return (
        <div>
            {params.username}
        </div>
    )
}

export default ProfilePage;
