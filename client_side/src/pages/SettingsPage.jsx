import React from 'react'
import { useSelector } from 'react-redux';

const SettingsPage = () => {
  // Hooks
  const user = useSelector(state => state?.user);

  console.log("State in settings page:", user);

  return (
    <div className='text-center text-gray-400 pt-2'>Settings Page, still under construction</div>
  )
}

export default SettingsPage;
