//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu


import React, { useState , useEffect} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import homeIcon from '../AssignImages/home.png';
import userIcon from '../AssignImages/user.png';
import menuIcon from '../AssignImages/menu.png';
import './Navbar.css';

const Navbar = ({user, setUser}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInfo , setUserInfo] = useState(null);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const navigate = useNavigate(); 

  const fetchUserInfo = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

      if (!token) {
        setUserInfo(null); 
        return;
      }

      const response = await fetch('http://localhost:8080/user-details', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data); 
      } else {
        console.error('Failed to fetch user details');
        setUserInfo(null); 
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUserInfo(null); 
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include', 
      });
  
      if (response.ok) {
        alert('Logged out successfully!');
        setUser(null);
        navigate('/home'); 
        window.location.reload();
      } else {
        alert('Failed to log out.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred. Please try again.');
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
            {user ? (
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
            {user ? (
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
          {user ? (
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