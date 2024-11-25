//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, { useState } from 'react';
import Dialog from './Dialog';

const ChangeImage = ({isOpen, onClose}) => {
  const [selectedFile, setSelectedFile] = useState('No file chosen');
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result); // Base64 이미지 데이터
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      alert('Please select an image file.');
      return;
    }

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

      const response = await fetch('http://localhost:8080/change-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: selectedFile }),
      });

      if (response.ok) {
        alert('Image changed successfully!');
        window.location.reload();
        onClose(); 
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to change image.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while changing the image.');
    }
  };


  return (
    //isOpen -> open dialog
    isOpen && (
      <Dialog
        title="Change your image"
        content={
          <>
            <label>New Image</label><br />
            <div className="line2">
              <label htmlFor="fileInput" className="choose-file">Choose File</label>
              <input type="file" id="fileInput" className="file-select" onChange={handleFileChange} />
              <span id="fileName">{selectedFile}</span>
            </div>
          </>
        }
        onClose={onClose}
        onSave={handleSave}
      />
    )
  );
};

export default ChangeImage;
