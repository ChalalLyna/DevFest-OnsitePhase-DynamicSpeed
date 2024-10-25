import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login.jsx'
import Dashboard from './pages/dashboard.jsx'
import './index.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </Router>

    </>
  )
}

export default App
