//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu


import React, { useEffect, useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Calendar from '@mui/icons-material/CalendarToday'; 
import People from '@mui/icons-material/People';
import Location from '@mui/icons-material/LocationOn';
import Available from '@mui/icons-material/Accessibility';
import Description from '@mui/icons-material/Description';
import './MyReservation.css';

function MyReservation({ user, facilities }) {
  const [reservations, setReservations] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const alertShown = useRef(false); 
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        if (!alertShown.current) {
          alert("You need to login to view this page.");
          alertShown.current = true; 
        }
        navigate("/sign-in");
        return; 
      }
    };
    const fetchReservations = async () => {
      try {
        const reservationResponse = await axios.get('http://localhost:8080/reservations');
        const fetchedReservations = reservationResponse.data.map(reservation => {
          // Find the matching facility details based on facility_id
          const facility = facilities.find(f => f.id === reservation.facility_id);
          return {
            ...reservation,
            // find in the faciltiy information, and if not found, set as default
            facilityName: facility ? facility.name : "Unknown Facility",
            location: facility ? facility.location : "Unknown Location",
            image: facility ? facility.image_url : "",
          };
        });
        setReservations(fetchedReservations); // Store merged reservations
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
    fetchUserInfo();
    if (facilities.length > 0) {
      setSelectedFacility(facilities[0]);
    }
  }, [facilities]);

  const handleCancel = async (index) => {
    const reservationToDelete = reservations[index];
    try {
      // Send a DELETE request to remove the reservation from the backend
      await axios.delete(`http://localhost:8080/reservations/${reservationToDelete.reservation_id}`);
      // Remove the reservation from the local state
      const updatedReservations = reservations.filter((_, i) => i !== index);
      setReservations(updatedReservations);
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  return (
    <div>
      {reservations.length === 0 ? (
        <h2>No reservations found.</h2>
      ) : ( 
        <div>
          {reservations.map((reservation, index) => (
            <div className="list-container" key={reservation.reservation_id}>
              <img 
                src={reservation.facility_image}
                alt={reservation.reservation_name} 
    
    
                className="list-image" 
              />
              <div className="list-detail">
                <h2>{reservation.reservation_name}</h2>
                <p><Description style={{ fontSize: 'clamp(12px, 2vw, 18px)' }}/> {reservation.purpose}</p>
                <p><Calendar style={{ fontSize: 'clamp(12px, 2vw, 18px)' }}/> {new Date(reservation.reservation_date).toLocaleDateString()}</p>
                <p><Location style={{ fontSize: 'clamp(12px, 2vw, 18px)' }}/> {reservation.facility_location}</p>
                <p><People style={{ fontSize: 'clamp(12px, 2vw, 18px)' }}/> {reservation.user_name} + {reservation.user_number - 1}</p>
                <p><Available style={{ fontSize: 'clamp(12px, 2vw, 18px)' }}/> {reservation.is_suny_korea ? 'Only for SUNY Korea' : 'Available to all'}</p>
                <button 
                  className="cancel-button" 
                  onClick={() => handleCancel(index)}
                >Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservation;
