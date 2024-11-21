//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, {useState, useEffect} from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import FacilityList from './pages/FacilityList';
import FacilityReservation from './pages/FacilityReservation';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = document.cookie.split("; ").find((row) => row.startsWith("authToken="))?.split("=")[1];
        try {
          const response = await fetch("http://localhost:8080/user", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data); // set User
          } else {
            console.error("Failed to fetch user info.");
          }
        } catch (error) {
          console.error("Error during login status check:", error);
        }
    };

    checkLoginStatus();
  }, []); // 

  useEffect(() => {
    // Fetch facilities data from the backend once on app load
    const getFacilities = async () => {
        try {
            const response = await fetch('http://localhost:8080/facilities');
            const data = await response.json();
            setFacilities(data); // Store fetched data using state
        } catch (error) {
            console.error('Failure', error);
        }
    };
    getFacilities();
}, []);

  return (
    <Router>
      <Navbar user = {user} setUser={setUser} />
      <div className="container">
      <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sign-in" element={<SignIn setUser = {setUser} />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/facility-list" element={<FacilityList facilities={facilities} />} />
          <Route path="/facility-reservation" element={<FacilityReservation facilities={facilities}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;