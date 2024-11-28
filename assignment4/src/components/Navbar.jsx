//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu


import React, { useState , useEffect, useRef} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import homeIcon from '../AssignImages/home.png';
import userIcon from '../AssignImages/user.png';
import menuIcon from '../AssignImages/menu.png';
import './Navbar.css';
const Navbar = ({user, setUser}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const alertShown = useRef(false); 
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const navigate = useNavigate(); 

  const [userInfo , setUserInfo] = useState(null);
  
  const fetchUserInfo = async () => {
    try {
      let token = localStorage.getItem("accessToken");

      if (!token) {
        setUserInfo(null);
        return;
      }

      let response = await fetch("http://localhost:8080/user-details", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      } else if (response.status === 401) {
        // if expired (401) request for refresh
        const refreshResponse = await fetch("http://localhost:8080/refresh", {
          method: "POST",
          credentials: "include", // include cookies
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem("accessToken", refreshData.accessToken);

          // retry with new token
          response = await fetch("http://localhost:8080/user-details", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${refreshData.accessToken}`,
            },
          });

          if (response.ok) {
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
      console.error("Error fetching user info:", error);
      setUserInfo(null);
      localStorage.removeItem("accessToken");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);


  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include", // 쿠키 포함
      });

      localStorage.removeItem("accessToken");
      setUserInfo(null);
      alert("Logged out successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred. Please try again.");
    }
  };


  return (
    <>
    <div className = "container">
      {/* Navbar for large screens */}
      <nav className="navbar-large">
        <ul>
          <li className="left-icon">
            <Link to="/home">
              <img src={homeIcon} width="30" height="30" alt="Home" />
            </Link>
          </li>
          <div className="center-icons">
            <li>
              <Link to="/facility-list">Facility List</Link>
            </li>
            <li>
              <Link to="/facility-reservation">Reservation</Link>
            </li>
            <li className="dropdown">
              <a href="#">User<span className="upsidedown-triangle"></span></a>
              <div className="dropdown-content">
                <Link to="/my-info">User Information</Link>
                <Link to="/my-reservation">Reservation History</Link>
              </div>
            </li>
            {userInfo? (
                <>
                  <li onClick={handleLogout}>
                    Sign Out
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/sign-in">Sign In</Link>
                </li>
              )}
          </div>

          <li className="right-button">
            {userInfo? (
              <div className = "group">
                <img src={userInfo?.image_url || userIcon} className='image' />
                <button onClick={handleLogout}>Sign Out</button>
              </div>
            ): (
              <Link to="/sign-in">
                <button>Sign in</button>
            </Link>
            )}
          </li>
        </ul>
      </nav>

      {/* Navbar for small screens */}
      <nav className="navbar-small">
        <ul>
          <li>
            <Link to="/home">
              <img src={homeIcon} width="30" height="30" alt="Home" />
            </Link>
          </li>
          <li id="menu-icon" onClick={toggleSidebar}>
            <img src={menuIcon} width="30" height="30" alt="Menu" />
          </li>
        </ul>
      </nav>

      {/* Side bar menu */}
      <nav className={`side-bar ${isSidebarOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link to="/facility-list">Facility List</Link>
          </li>
          <li>
            <Link to="/facility-reservation">Reservation</Link>
          </li>
          <li className="dropdown">
            <a href="#">User<span className="upsidedown-triangle"></span></a>
            <div className="dropdown-content">
              <Link to="/my-info">User Information</Link>
              <Link to="/my-reservation">Reservation History</Link>
            </div>
          </li>
          {userInfo ? (
                <>
                  <li onClick={handleLogout}>
                    Sign Out
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/sign-in">Sign In</Link>
                </li>
              )}
        </ul>
      </nav>
      </div>
    </>
  );
};

export default Navbar;