//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, { useState } from 'react';
import Dialog from './Dialog';
import { hashutil } from '../../Hashutil.js';


const ChangePwd = ({ isOpen, onClose , email}) => {
  const [oldPassword,setOldPassword] = useState(' ');
  const [newPassword, setNewPassword] = useState('');
  const handleSave = async () => {
    if (!newPassword || !oldPassword) {
      alert('Enter valid password');
      return;
    }
    try {
      const hashedOldPassword = hashutil(email, oldPassword);
      const hashedNewPassword = hashutil(email, newPassword);
      const token = localStorage.getItem('accessToken');

      const response = await fetch('http://localhost:8080/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword: hashedOldPassword, newPassword: hashedNewPassword }),
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
            <label htmlFor="oldPassword">Old Password</label><br />
            <div className="line2">
            <input
              type="password"
              placeholder="Enter your original password"
              id="oldPassword"
              className="new-input"
              value={oldPassword}
              onChange={(e) => 
                setOldPassword(e.target.value)
              }
            />
            </div>
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
