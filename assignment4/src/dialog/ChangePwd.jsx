//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, { useState } from 'react';
import Dialog from './Dialog';

const ChangePwd = ({ isOpen, onClose }) => {

  const [newPassword, setNewPassword] = useState('');

  const handleSave = async () => {
    if (!newPassword) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

      const response = await fetch('http://localhost:8080/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        alert('Password changed successfully!');
        onClose();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to change password.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while changing the password.');
    }
  };
  return (
    //isOpen -> open dialog
    isOpen && (
      <Dialog
        title="Change your password"
        content={
          <>
            <label htmlFor="newPassword">New Password</label><br />
            <div className="line2">
            <input
              type="password"
              placeholder="Enter the new password"
              id="newPassword"
              className="new-input"
              value={newPassword}
              onChange={(e) => 
                setNewPassword(e.target.value)
              }
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
export default ChangePwd;
