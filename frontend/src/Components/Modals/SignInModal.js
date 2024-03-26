import React, { useState } from "react";
import { useAuth } from "../../Contexts/authContext";
import { decodeToken } from "../../Utils/auth";

const SignInModal = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { signIn } = useAuth();

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch API endpoint for signing in
    try {
      const response = await fetch("http://localhost:5000/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // If sign-in successful, redirect or perform necessary action
        const { token } = await response.json();

        // Store the JWT token securely in the browser's local storage
        localStorage.setItem("token", token);
        signIn();
        await props.toggleSignInModal(false);
        props.setAuthenticated(true);
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          props.setUserName(decodedToken.email); // Assuming the token contains the user's ID
        }
        console.log("Sign-in successful!");
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
      </form>
    </div>
  );
};

export default SignInModal;
