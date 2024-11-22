//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, { useState } from 'react';
import Dialog from './Dialog';

const ChangeName = ({ isOpen, onClose }) => {
  // initially just set to an empty string
  const [newName, setNewName] = useState('');

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
              onChange={(e) => setNewName(e.target.value)}
               // Update state when input changes
            />
            </div>
          </>
        }
        onClose={onClose}
        onSave={() => alert('Name change is not currently available.')}
      />
    )
  );
};

export default ChangeName;
