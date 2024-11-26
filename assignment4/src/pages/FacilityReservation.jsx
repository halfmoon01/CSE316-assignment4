//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, { useState , useEffect, useRef} from "react";
import axios from 'axios'
import {useNavigate} from 'react-router-dom';
import Calendar from '@mui/icons-material/CalendarToday'; 
import People from '@mui/icons-material/People';
import Location from '@mui/icons-material/LocationOn';
import Available from '@mui/icons-material/Accessibility';
import "./FacilityReservation.css";

function FacilityReservation({user, facilities}) { // Accept facilities from "App.jsx"
  const [userInfo , setUserInfo] = useState(null);
  const alertShown = useRef(false); 
  const navigate = useNavigate();
  const fetchUserInfo = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

        if (!token) {
          setUserInfo(null);
          if (!alertShown.current) {
            alert("You need to login to view this page.");
            alertShown.current = true; 
          }
          navigate("/sign-in");
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

    const [reservations, setReservations] = useState([]); 
    const [selectedFacility, setSelectedFacility] = useState(null); 
    const [formData, setFormData] = useState({
    date: '',
    people: '',
    affiliation: 'SUNY Korea',
    purpose: ''
  });

  // Fetch reservations data
  const fetchReservations = async () => {
    try {
        const reservationResponse = await axios.get('http://localhost:8080/reservations');
        setReservations(reservationResponse.data); // Store reservations
    } catch (error) {
        console.error("Error fetching reservations:", error);
    }
  };

  // Fetch facilities and reservations data
  useEffect(() => {
    fetchReservations();

    if (facilities.length > 0) {
      setSelectedFacility(facilities[0]);
    }
  }, [facilities]);

  const FacilitySelect = (event) => {
    const selectedName = event.target.value;
    const facility = facilities.find(f => f.name === selectedName);
    setSelectedFacility(facility);
  };

  const handleFormChange = (f) => {
    const { name, value } = f.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];
    const today = new Date();
    const minCapacity = selectedFacility.min_capacity;
    const maxCapacity = selectedFacility.max_capacity;
    const f_people = parseInt(formData.people);

    // Case0: Don't accpet null
    if (!formData.date || !f_people || !formData.purpose) {
       alert("0: Cannot reserve: Some parts are missing");
       return;
    }
    // Case1: Check if the selected date is in the past
    if (new Date(formData.date) < today) {
      errors.push("1: Cannot reserve: Selected date is in the past");
    }
    // Case2: Check if the number of people is within the allowed range
    if (f_people < minCapacity || f_people > maxCapacity) {
      errors.push(`2: Cannot reserve: available number of members: ${minCapacity} ~ ${maxCapacity}`);
    }
    // Case3: Check if the facility is restricted to SUNY Korea members only
    if (selectedFacility.only_for_suny && formData.affiliation !== "SUNY Korea") {
        errors.push("3: Cannot reserve: SUNY Korea members only");
      }
    
    // Case 4: Check if the selected facility is already reserved)
    const facilityConflict = reservations.find(
        reservation => reservation.reservation_name === selectedFacility.name
    );
    if (facilityConflict) {
        errors.push("4: Cannot reserve: This facility is already reserved.");
    }

    // Case 5: Check if there is already a reservation on the same date
    const dateConflict = reservations.find(
        reservation => {
            const reservationDate = new Date(reservation.reservation_date);
            const formDate = new Date(formData.date);
            
            return (
                reservationDate.getFullYear() === formDate.getFullYear() &&
                reservationDate.getMonth() === formDate.getMonth() &&
                reservationDate.getDate() === formDate.getDate()
            );
        }
    );
    if (dateConflict) {
        errors.push("5: Cannot reserve: A reservation already exists on this date.");
    }

    // Case6: Check if it satisfies the reservation date
    if (formData.date) {
        const [year, month, day] = formData.date.split('-');
        const DayOfWeek = computeDayOfWeek(year, month, day);
        const availableDayList = selectedFacility.available_days.split(',').map(day => day.trim());
    
    if (!availableDayList.includes(DayOfWeek)) {
      errors.push(`6: Cannot reserve: The facility is not available on ${DayOfWeek}.`);
    }
    } else {
    errors.push("Please select a valid date.");
    }
  


    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const reservationData = {
        facility_id: selectedFacility.id, 
        reservation_date: formData.date,
        user_number: formData.people,
        purpose: formData.purpose,
        user_name: userInfo.name
      };
  
      try {
        // Use await with axios.post inside async function
        const response = await axios.post('http://localhost:8080/reservations', reservationData);
        alert(response.data.message);

        // fetch reservations again to update it. 
        //((in case of making reservation without reentering this page))
        await fetchReservations();

        // Reset form data after successful submission
        setFormData({
          date: '',
          people: '',
          affiliation: 'SUNY Korea',
          purpose: ''
        });
      } catch (error) {
        console.error('Failed to save reservation:', error);
        alert('Error: Could not save the reservation.');
      }
  };

  return (
    <div className="reservation-container">
      <select onChange={FacilitySelect} className="select">
        {facilities.map((facility, index) => (
          <option key={index} value={facility.name}>
            {facility.name}
          </option>
        ))}
      </select>
      {selectedFacility && (
      <div className="selected-container">
        <img src={selectedFacility.image_url} alt={selectedFacility.name} className="selected-image" />
        <div className="selected-details">
          <h2>{selectedFacility.name}</h2>
          <p>{selectedFacility.description}</p>
          <p><Calendar style={{ fontSize: 'clamp(12px, 2vw, 18px)' }}/> Available Days: {selectedFacility.available_days}</p>
          <p><People style={{ fontSize: 'clamp(12px, 2vw, 18px)' }}/> Capacity: {selectedFacility.min_capacity} - {selectedFacility.max_capacity}</p>
          <p><Location style={{ fontSize: 'clamp(12px, 2vw, 18px)' }}/> Location: {selectedFacility.location}</p>
          <p><Available style={{ fontSize: 'clamp(12px, 2vw, 18px)' }}/> {selectedFacility.only_for_suny ? 'Only for SUNY Korea' : 'Available to All'}</p>
        </div>
      </div>
    )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date to be Used:</label><br />
          <input 
            type="date" 
            className="text" 
            name="date" 
            value={formData.date} 
            onChange={handleFormChange} 
          />
        </div>
        <div>
          <label>Number of People:</label><br />
          <input 
            type="number" 
            className="text" 
            name="people" 
            value={formData.people} 
            onChange={handleFormChange} 
          />
        </div>
        <div className="radio">
          <input 
            type="radio" 
            name="affiliation" 
            value="SUNY Korea" 
            checked={formData.affiliation === 'SUNY Korea'} 
            onChange={handleFormChange} 
          /> SUNY Korea
          <input 
            type="radio" 
            name="affiliation" 
            value="Non-SUNY Korea"
            checked={formData.affiliation === 'Non-SUNY Korea'} 
            onChange={handleFormChange} 
          /> Non-SUNY Korea
        </div>
        <div>
          <label>Purpose of Use:</label><br />
          <textarea 
            rows="4" 
            className="textarea" 
            name="purpose" 
            value={formData.purpose} 
            onChange={handleFormChange} 
          />
        </div>
        <button type="submit" className="reservation-submit">Submit</button>
      </form>
    </div>
  );
}

function computeDayOfWeek(year, month, day) {
    const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
    
    let q = parseInt(day);
    let m = parseInt(month);
    let y = parseInt(year);
    if (m === 1 || m === 2) {
      m += 12;
      y -= 1;
    }
    let k = y % 100;  
    let j = Math.floor(y / 100);  
    let h = (q + Math.floor(13 *(m+1)/5)+k+Math.floor(k/4)+Math.floor(j/4)-2*j) % 7;
    if (h < 0) {
      h += 7;
    }
    return days[h]; 
  }
  
export default FacilityReservation;



