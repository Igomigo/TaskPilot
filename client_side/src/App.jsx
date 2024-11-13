import React from 'react'
import './App.css'
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
      <main>
        <Outlet></Outlet>
      </main>
    </>
  )
}

export default App;
