import React, { useEffect } from 'react'
import './App.css'
import toast, { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

const App = () => {

  return (
    <>
      <Toaster />
      <main>
        <Outlet></Outlet>
      </main>
    </>
  )
}

export default App;
