//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import homeIcon from '../AssignImages/home.png';
import userIcon from '../AssignImages/user.png';
import menuIcon from '../AssignImages/menu.png';
import './Navbar.css';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
            <li>
              <Link to="/sign-in">Sign In</Link>
            </li>
          </div>

          <li className="right-icon">
            {/* <img src={userIcon} width="30" height="30" alt="User" /> */}
            <Link to="/sign-in">
                <button className='Sign-in' >Sign in</button>
            </Link>
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
          <li>
            <Link to="/sign-in">Sign In</Link>
          </li>
        </ul>
      </nav>
      </div>
    </>
  );
};

export default Navbar;