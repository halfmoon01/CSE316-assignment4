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
  const [userInfo, setUserInfo] = useState(null);
  
    // State management: Dialog open states
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [isPwdOpen, setIsPwdOpen] = useState(false);
    const [isNameOpen, setIsNameOpen] = useState(false);
    const alertShown = useRef(false); 

    const fetchUserInfo = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      if (!token) {
        if (!alertShown.current) {
          alert("You need to login to view this page.");
          alertShown.current = true; 
        }
        navigate("/home");
        return; 
      }

      try {
        const response = await fetch("http://localhost:8080/user-details", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include", 
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data); 
        }else {
          throw new Error("Failed to fetch user details.");
        }
      }catch (error) {
        console.error("Error fetching user details:", error);
        if (!alertShown.current) {
          alert("Invalid or expired token. Redirecting to login page.2");
          alertShown.current = true;
        }
        navigate("/home");
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
        />
      <ChangeName 
        isOpen={isNameOpen} 
        onClose={() => setIsNameOpen(false)} 
      />
        
    </div>
  );
};
export default UserInfo;