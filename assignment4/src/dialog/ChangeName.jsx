//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, { useState } from 'react';
import Dialog from './Dialog';

const ChangeName = ({ isOpen, onClose}) => {
  // initially just set to an empty string
  const [newName, setNewName] = useState('');

  const handleSave = async () => {
    if (!newName.trim()) {
      alert('Name cannot be empty.');
      return;
    }
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

      const response = await fetch('http://localhost:8080/change-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newName }),
      });

      if (response.ok) {
        alert('Name changed successfully!');
        window.location.reload();
        onClose(); 
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to change name.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while changing the name.');
    }
  };

  return (
    //isOpen -> open dialog
    isOpen && (
      <Dialog
        title="Change your name"
        content={
          <>
            <label htmlFor="newName">New Name</label><br />
            <div className="line2">
            <input
              type="text"
              placeholder="Enter the new name"
              id="newName"
              className="new-input"
              value={newName}
              onChange={(e) => 
                setNewName(e.target.value)}
               // Update state when input changes
            />
            </div>
          </>
        }
        onClose={onClose}
        onSave={handleSave}
      />
    )
  );
};

export default ChangeName;
