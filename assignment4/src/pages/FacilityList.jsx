// Sanghyun Jun
// Sanghyun.Jun.1@stonybrook.edu

import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import "./FacilityList.css"; 
import Calendar from '@mui/icons-material/CalendarToday'; 
import People from '@mui/icons-material/People';
import Location from '@mui/icons-material/LocationOn';
import Available from '@mui/icons-material/Accessibility';
const FacilityList = ({ facilities }) => {
  const alertShown = useRef(false); 
  const navigate = useNavigate();
  const [userInfo , setUserInfo] = useState(null);
  
   
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUserInfo(null);
        if (!alertShown.current) {
          alert("You need to login to view this page.");
          alertShown.current = true;
        }
        navigate("/sign-in"); // Navigate to the sign-in page
        return;
      }
  
      let response = await fetch("http://localhost:8080/user-details", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
  
      // If response is successful, set user info
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        return; 
      }
  
      // If the response status is 401 (Unauthorized), token might be expired, so try refreshing
      if (response.status === 401) {
        console.log("Token expired. Attempting to refresh...");
  
        const refreshResponse = await fetch("http://localhost:8080/refresh", {
          method: "POST",
          credentials: "include",
        });
         // If the refresh token is valid, store the new access token and retry fetching user info
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem("accessToken", refreshData.accessToken);

          response = await fetch("http://localhost:8080/user-details", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${refreshData.accessToken}`,
            },
            credentials: "include",
          });
  
          if (response.ok) {
            console.log("Refresh Success!");
            const data = await response.json();
            setUserInfo(data);
            return; 
          }
        }
  
        console.error("Failed to fetch user info after refreshing token.");
      }
  
      throw new Error("Failed to fetch user details.");
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserInfo(null);
  
      if (!alertShown.current) {
        alert("Your session has expired. Please login again.");
        alertShown.current = true;
      }
      localStorage.removeItem("accessToken");
      navigate("/sign-in");
    }
  };
  
  useEffect(() => {
    fetchUserInfo();
  }, [navigate]);
  
    
  return (
    <div className="facility-list">
      {/* Map over the facilities array and render each item */}
      {facilities.map((facility, index) => (
        <div key={index} className="facility-container">
          {facility.isODD ? (
            // if odd, make a blank block 
            <div className="blank-block"></div> 
          ) : (
            <>
            {/* Display facility image */}
              <img
                src={facility.image_url} 
                alt={facility.name}
                className="facility-image"
              />
              <div className="facility-details">
                <h2>{facility.name}</h2>
                <p>{facility.description}</p>
                <p><Calendar /> {facility.available_days}</p> 
                <p><People /> {facility.min_capacity} - {facility.max_capacity}</p> 
                <p><Location /> {facility.location}</p>
                <p><Available /> {facility.only_for_suny ? "Only for SUNY Korea" : "Available to all"}</p> {/* SUNY 접근 제한 여부 */}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default FacilityList;
