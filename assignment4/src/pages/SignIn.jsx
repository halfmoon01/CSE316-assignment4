//Sanghyun Jun
//Sanghyun.Jun.1@stonybrook.edu

import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { hashutil } from '../../Hashutil';

import './SignIn.css';
const SignIn = ({setIsLoggedIn}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const hashedPassword = hashutil(formData.email, formData.password);
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: hashedPassword,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }

      const data = await response.json();
      setIsLoggedIn(true); 
      alert(`Welcome, ${data.name}!`); 
      navigate("/home"); 
    } catch (error) {
      alert("Failed to connect to the server. Please try again.");
    }

  };

  return (
    <form className = "SignInForm" onSubmit={handleSubmit}>
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
        <Link to="/sign-up">
          <button className="UP">Sign Up</button>
        </Link>
      </div>
    </form>
  );
};

export default SignIn;