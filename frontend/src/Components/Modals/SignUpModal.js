import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Erroralert from "../Alerts/Erroralert";
import Spinner from "../Alerts/Spinner";

const SignUpModal = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [loading, setLoading] = useState(false);
  const apiUrl=process.env.REACT_APP_URL;

  const [error_message, setErrorMessage] = useState({
    flag: false,
    message: "",
  });
  const handleSubmit = async (e) => {
    console.log(apiUrl)
    e.preventDefault();
    setLoading(true);
    console.log("Form data:", formData); // Log form data
    setErrorMessage({
      flag: false,
      message: "",
    });

    if (formData.password !== formData.cpassword) {
      setErrorMessage({
        flag: true,
        message: "Passwords do not match",
      });
      setLoading(false);
      return;
    }
    // Check if name contains only letters
    const nameRegex = /^(?=.*[A-Za-z])[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    if (!nameRegex.test(formData.name)) {
      setErrorMessage({
        flag: true,
        message: "Name should only contain letters and no extra spaces allowed",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Sign-up successful!");
        setLoading(false);

        await props.toggleSignUpModal(false);
        alert("Welcome..!! Now You Can Login");
      } else {
        const responseData = await response.json();
        setLoading(false);

        console.error("Sign-up failed:", responseData.error);
        if (response.status === 500) {
          console.error("Internal Server Error");
          setErrorMessage({
            flag: true,
            message: "Internal Server Error. Please try again later.",
          });
        } else if (
          response.status === 400 &&
          responseData.error === "Email already exists"
        ) {
          console.error("Email already exists");
          setErrorMessage({
            flag: true,
            message:
              "The provided email address is already registered. Please use a different email.",
          });
          setLoading(false);

        } else {
          console.error("Sign-up failed:", responseData.error);
          setErrorMessage({
            flag: true,
            message:
              "Failed to sign up. Please check your input and try again.",
          });
          setLoading(false);

        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage({
        flag: true,
        message:
        "Failed to sign up. Please check your input and try again.",
      });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-center">Sign Up</h2>
      {loading && <Spinner />}
      {error_message.flag && (
        <Erroralert error_message={error_message.message} />
      )}

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
            required
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
            required
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
