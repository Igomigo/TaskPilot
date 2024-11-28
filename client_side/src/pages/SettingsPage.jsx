import React from 'react'
import { useSelector } from 'react-redux';

const SettingsPage = () => {
  // Hooks
  const user = useSelector(state => state?.user);

  console.log("State in settings page:", user);

  return (
    <div>
      Settings Page
    </div>
  )
}

export default SettingsPage;
