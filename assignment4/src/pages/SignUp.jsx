//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu
import { hashutil } from '../../Hashutil';
import React, { useState } from "react";
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    name: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (formData.password !== formData.password2){
        alert("Confirm password is not the same with password");
        return;
    }

    try {
        const hashedPassword = hashutil(formData.email, formData.password);
        const response = await fetch("http://localhost:8080/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: hashedPassword,
            name: formData.name,
          }),
        });
        
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          return;
        }
        alert(data.message );
      } catch (error) {
        alert("Failed to connect to the server. Please try again.");
      }
    };
  

  return (
    <form className = "SignUpForm" onSubmit={handleSubmit}>
      <div className="title">
        <h1>Sign Up</h1>
      </div>
      <div className="email_input">
        <label htmlFor="email">Email:</label><br />
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className = "password_input">
        <label htmlFor="password">Password:</label><br />
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className = "password_check">
        <label htmlFor="password_check">Password Check:</label><br />
        <input
          type="password"
          id="password_check"
          name="password2"
          value={formData.password2}
          onChange={handleChange}
        />
      </div>

      <div className = "name_input">
        <label htmlFor="password">User Name</label><br />
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="button-group">
        <button type="submit">Sign Up</button>
      </div>
    </form>
  );
};

export default SignUp;