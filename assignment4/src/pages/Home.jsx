//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, { useEffect } from "react";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <ul className="main-list">
        <li>Facility List</li>
        <ul className="sub-list">
          <li>Show list of facilities.</li>
          <li>name, description, location, min capacity, max capacity, image, onlySUNY, available day of the week</li>
        </ul>
        <li>Facility Reservation</li>
        <ol className="numbered-list">
          <li>Reservation Date should be the date after today</li>
          <li>The number of users should be between the maximum number of people and the minimum number of people</li>
          <li>If the facility is available only for SUNY Korea, user should be in SUNY Korea</li>
          <li>The reservation date must be made on the available day of the week</li>
          <li>If someone booked the facility on that date, no one else can book the facility on that date</li>
        </ol>
        <ul className="sub-list">
          <li>If all conditions are met, data is stored in the database</li>
        </ul>
        <li>User</li>
      </ul>
    </div>
  );
};

export default Home;

