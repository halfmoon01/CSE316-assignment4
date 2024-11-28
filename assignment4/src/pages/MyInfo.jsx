// Sanghyun Jun
// Sanghyun.Jun.1@stonybrook.edu


import React, { useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import userIcon from '../AssignImages/user.png';
import './MyInfo.css'; 
import ChangePwd from '../dialog/ChangePwd'
import ChangeImage from '../dialog/ChangeImage'
import ChangeName from '../dialog/ChangeName'


const UserInfo = () => {
  const navigate = useNavigate();
    // State management: Dialog open states
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [isPwdOpen, setIsPwdOpen] = useState(false);
    const [isNameOpen, setIsNameOpen] = useState(false);
    const alertShown = useRef(false); 

    const [userInfo, setUserInfo] = useState(null);
    const fetchUserInfo = async () => {
      try {
        let token = localStorage.getItem("accessToken");
        // If no token is found, navigate to the sign-in pagㄷ
        if (!token) {
          if (!alertShown.current) {
            alert("You need to login to view this page.");
            alertShown.current = true;
          }
          navigate("/sign-in");
          return;
        }
  
        // Fetch user details using the access token
        let response = await fetch("http://localhost:8080/user-details", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
  
        // If the response is successful, update the userInfo state with the data
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else if (response.status === 401) {
          // If the token is expired (status 401), attempt to refresh it
          console.log("Token expired. Attempting to refresh...");
          const refreshResponse = await fetch("http://localhost:8080/refresh", {
            method: "POST",
            credentials: "include", // Include cookie
          });
  
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem("accessToken", refreshData.accessToken);
  
            // try again
            response = await fetch("http://localhost:8080/user-details", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${refreshData.accessToken}`, // // Use the refreshed token
              },
              credentials: "include",
            });
            // If successful, update userInfo state
            if (response.ok) {
              console.log("Refresh Success!");
              const data = await response.json();
              setUserInfo(data);
            } else {
              throw new Error("Failed to fetch user info after refreshing token.");
            }
          } else {
            throw new Error("Refresh token invalid or expired.");
          }
        } else {
          throw new Error("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
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
  
  
    if (!userInfo) {
      return;
    }

  return (
    <div className="myInfo">
      <h1>User Information</h1>
      <figure>
        <div>
          <img src={userInfo.image_url || userIcon} className='image'/>
        </div>
      </figure>
      <button className="button_type1" type="button" onClick={() => setIsImageOpen(true)}>
        Change Image
      </button>
      <p>Email: {userInfo.email}</p>
      <p>
        Password: ********* <br/><br/>
        <button className="button_type1" type="button" onClick={() => setIsPwdOpen(true)}>
          Change Password
        </button>
      </p>
      <p>
        Name: {userInfo.name} <br/><br/>
        <button className="button_type1" type="button" onClick={() => setIsNameOpen(true)}>
          Change Name
        </button>
      </p>
      {/* Dialog components for changing image, password, and name */}
      <ChangeImage 
        isOpen={isImageOpen} 
        onClose={() => setIsImageOpen(false)} 
      />

      <ChangePwd 
        isOpen={isPwdOpen} 
        onClose={() => setIsPwdOpen(false)}
        email = {userInfo.email}
        />
      <ChangeName 
        isOpen={isNameOpen} 
        onClose={() => setIsNameOpen(false)} 
      />
        
    </div>
  );
};
export default UserInfo;