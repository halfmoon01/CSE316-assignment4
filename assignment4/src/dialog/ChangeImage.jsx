//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, { useState } from 'react';
import Dialog2 from './Dialog_Image';

const ChangeImage = ({isOpen, onClose}) => {
  const [selectedFile, setSelectedFile] = useState('No file chosen');
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result); 
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
      let token = localStorage.getItem('accessToken');
      if (!token) {
        alert("You need to login to perform this action.");
        return;
      }
      let response = await fetch('http://localhost:8080/change-image', {
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
      } else if (response.status === 401) {
        // Token expired, try to refresh
        console.warn("Token expired. Attempting to refresh...");
        const refreshResponse = await fetch("http://localhost:8080/refresh", {
          method: "POST",
          credentials: "include",
        });
        // if refreshed token is ok, set it as accessToken
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem("accessToken", refreshData.accessToken);

          // Retry changing the image
          response = await fetch("http://localhost:8080/change-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshData.accessToken}`,
            },
            body: JSON.stringify({ image: selectedFile }),
          });
          // if response is okay -> alert and close the dialog
          if (response.ok) {
            alert("Image changed successfully!");
            window.location.reload();
            onClose();
          } else {
            const data = await response.json();
            alert(data.message || "Failed to change image.");
          }
        } else {
          throw new Error("Refresh token invalid or expired.");
        }
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
      <Dialog2
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
