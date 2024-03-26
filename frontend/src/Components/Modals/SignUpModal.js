import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Erroralert from "../Alerts/Erroralert";

const SignUpModal = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: ""
  });

  const [error_message, setErrorMessage] = useState({
    flag: false,
    message: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData); // Log form data
    setErrorMessage({
      flag: false,
      message: ""
    });
  
    if (formData.password !== formData.cpassword) {
      setErrorMessage({
        flag: true,
        message: "Passwords do not match"
      });
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        console.log("Sign-up successful!");
        await props.toggleSignUpModal(false);
        alert("Welcome");
      } else {
        const responseData = await response.json();
        console.error("Sign-up failed:", responseData.error);
        if (response.status === 500) {
          console.error("Internal Server Error");
          setErrorMessage({
            flag: true,
            message: "Internal Server Error. Please try again later."
          });
        } else if (response.status === 400 && responseData.error === 'Email already exists') {
          console.error("Email already exists");
          setErrorMessage({
            flag: true,
            message: "The provided email address is already registered. Please use a different email."
          });
        } else {
          console.error("Sign-up failed:", responseData.error);
          setErrorMessage({
            flag: true,
            message: "Failed to sign up. Please check your input and try again."
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage({
        flag: true,
        message: "Failed to sign up. Please check your internet connection and try again."
      });
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-center">Sign Up</h2>
      {error_message.flag && <Erroralert error_message={error_message.message} />}
     
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:-
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:-
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:-
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password:-
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            value={formData.cpassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpModal;