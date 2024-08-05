// SignInModal.js (path:- frontend\src\Components\Modals\SignInModal.js)

import React, { useState } from "react";
import { useAuth } from "../../Contexts/authContext";
import { decodeToken } from "../../Utils/auth";
import { useNavigate } from 'react-router-dom';

const SignInModal = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { signIn, isAuthenticated } = useAuth();
  const apiUrl = process.env.REACT_APP_URL;
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        signIn();
        await props.toggleSignInModal(false);
        props.setAuthenticated(true);
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          props.setUserName(decodedToken.email);
        }
        console.log("Sign-in successful!");
        window.location.reload();
      } else {
        const responseData = await response.json();
        console.error("Sign-in failed:", responseData.error);
        setErrorMessage(responseData.error);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setErrorMessage("Failed to sign in. Please try again later.");
    }
  };

  const handleForgotPasswordClick = () => {
   navigate('/request-reset-password'); // Navigate to the forgot password page
   props.toggleSignInModal(false);
  };

  return (
    <div>
      <h2 className="text-center">Sign In</h2>
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary">
          Sign In
        </button>
        <div className="mt-3">
          <button 
            type="button" 
            className="btn btn-link" 
            onClick={handleForgotPasswordClick}
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInModal;
