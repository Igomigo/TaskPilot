import React from 'react'
import './App.css'
import { Outlet } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

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
