import React, { useState } from "react";
import Modal from "react-modal";
import {useNavigate} from 'react-router-dom';
import { useLocation } from "react-router-dom";
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "600px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    backgroundImage: "linear-gradient(to bottom right, #6610f2, #2c3e50)", // Corrected background property
    color: "#fff",
    overflow: "visible",
  },
};

const AdminSignup = () => {
  const apiUrl=process.env.REACT_APP_URL;

  let flag=false;
  const [isOpen, setIsOpen] = useState(false);
  const [adminname, setAdminname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true); // State to track password match status
  const [emailExists, setEmailExists] = useState(false); // State to track if email already exists
const location=useLocation();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
const navigate=useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setPasswordsMatch(true);
    setEmailExists(false)
    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordsMatch(false); // Set passwords match status to false
      return; // Don't submit the form if passwords don't match
    }
    // Passwords match, proceed with form submission
    try {
      // Send admin signup data to the backend
      const response = await fetch(`${apiUrl}/admin/adminsignup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminname, email, password }),
      });
  
      // Check if the request was successful
      if (response.ok) {
        // If successful, close the modal
        alert("Admin Added Successfully...!!")
        closeModal();
        navigate("/admin")
        // Optionally, you can handle any success message or redirect the user
      } else {
        // If there was an error
        const responseData = await response.json(); // Parse response JSON data
        const errorMessage = responseData.message; // Access the error message
        console.log("The error mesg:",errorMessage);
        if (errorMessage === "Email already exists") {
          setEmailExists(true); // Set email exists status to true
        } else {
          throw new Error("Failed to signup admin");
        }
      }
    } catch (error) {
      console.error("Error signing up admin:", error);
      // Optionally, you can display an error message to the user
    }
  };
  let btnname="+ Add Admin"
  
  if(location.pathname==="/admin"){
    flag=true
    btnname="SignUp"
  }
  console.log("button flag:- ",location.pathname)
  return (
    <div>
      <button className={`btn ${flag ? "btn-primary" : "btn-success"}`}
 onClick={openModal}>
        {btnname}
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Admin Signup Modal"
      >
        <form onSubmit={handleSubmit} className="d-flex flex-column ">
          <h2 className="mb-4">Admin Signup</h2>
          <div className="mb-3">
            <label htmlFor="adminname" className="form-label">
              Admin Name
            </label>
            <input
              type="text"
              className="form-control"
              id="adminname"
              value={adminname}
              onChange={(e) => setAdminname(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailExists && <p className="text-danger"><b>Email already exists..!</b></p>}{" "}
            {/* Error message */}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!passwordsMatch && (
              <p className="text-danger"><b>Passwords do not match..!</b></p>
            )}{" "}
            {/* Error message */}
          </div>
          <div></div>
          <button type="submit" className="btn btn-success">
            Signup
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSignup;
