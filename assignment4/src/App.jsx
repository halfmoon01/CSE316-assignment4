//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, {useState, useEffect} from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
      <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;