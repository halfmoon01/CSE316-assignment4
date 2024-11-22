//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, { useState } from 'react';
import Dialog from './Dialog';

const ChangePwd = ({ isOpen, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
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
              onChange={(e) => setNewPassword(e.target.value)}
            />
            </div>
          </>
        }
        onClose={onClose}
        onSave={() => alert('Password change is not currently available.')}
      />
    )
  );
};
export default ChangePwd;
