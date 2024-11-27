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
import MyInfo from './pages/MyInfo';
import MyReservation from './pages/MyReservation';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [facilities, setFacilities] = useState([]);


  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("accessToken");
      if(!token){
        console.log("NOT LOGGED IN");
        return;
      }
      console.log("LOGGED IN");  
      try {
          const response = await fetch("http://localhost:8080/user", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.email); // set User
            console.log(data.email);
          } else {
            console.log("Not logged in");
            localStorage.removeItem("accessToken");
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
          <Route path="/facility-reservation" element={<FacilityReservation user = {user} facilities={facilities}/>} />
          <Route path="/my-info" element={<MyInfo />} />
          <Route path="/my-reservation" element={<MyReservation user = {user} facilities={facilities} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;