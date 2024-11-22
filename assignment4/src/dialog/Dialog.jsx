//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React from 'react';
import '../dialog/Dialog.css';

const Dialog = ({ title, content, onClose, onSave }) => {
  // use onClose and onSave when clicking
  return (
    <div className="dialog">
      <div className="content">
        <span className="close-icon" onClick={onClose}>&times;</span>
        <p className="dialog-title">{title}</p>
        <hr className="line"/>
        {content}
        <hr className="line"/>
        <div className="button-group">
          <button type="button" className="close-button" onClick={onClose}>
            Close
          </button>
          <button type="button" className="save-button" onClick={onSave}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
