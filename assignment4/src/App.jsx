//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, {useState, useEffect} from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
      </div>
    </Router>
  );
}

export default App;