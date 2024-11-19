//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password || !formData.password2 || !formData.name) {
      alert("Please fill every fields.");
    }else if (formData.password !== formData.password2){
        alert("Check password is not the same with password");
    }else
        alert("User registered successfully!");
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