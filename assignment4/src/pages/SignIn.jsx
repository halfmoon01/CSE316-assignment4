//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, { useState } from "react";
import './SignIn.css';
const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please fill in both email and password.");
    }else{
      alert("Sucess!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="title">
        <h1>Sign In</h1>
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
      <div className="button-group">
        <button className = "IN" type="submit">Sign In</button>
        <button className = "UP">Sign Up</button>
      </div>
    </form>
  );
};

export default SignIn;