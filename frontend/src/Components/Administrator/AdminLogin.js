import React, { useState } from "react";
import styled from "styled-components";
import {Link, useNavigate} from 'react-router-dom';
import { useAdminAuth } from '../../Contexts/AdminAuthContext';
import AdminSignup from "./AdminSignUp";
const apiUrl=process.env.REACT_APP_URL;

const Wrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(
    to bottom right,
    #6610f2,
    #2c3e50
  ); /* Gradient bluish background */
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #fff; /* White text color */
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 18px;
  margin-bottom: 5px;
  color: #fff; /* White text color */
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: #fff; /* Darker input background color */
  #000; /* White text color */
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  background-color: #28a745; /* Green button color */
  color: #fff; /* White text color */
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838; /* Darker green button color on hover */
  }
`;
const ErrorMessage = styled.p`
  color: #ff0000; /* Red color for error message */
`;
const AdminLogin = () => {
  const [adminname, setAdminname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { adminSignIn } = useAdminAuth();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
const navigate= useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Clear previous error message

    try {
      const response = await fetch(`${apiUrl}/admin/adminlogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Admin login successful, handle accordingly (e.g., redirect)
        alert("Admin login successful");
        const { token } = await response.json();
        console.log(token)
        // Store the JWT token securely in the browser's local storage
        localStorage.setItem("adminToken", token);
        adminSignIn();
        navigate("/admindash")
        
      } else {
        // Admin login failed, display error message
        const responseData = await response.json();
        setErrorMessage(responseData.error || "Admin login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Failed to log in. Please try again later.");
    }
  };
  return (
    <>
    

    <Wrapper className="mt-3" style={{ marginBottom: "50px" }}>
      <Title>Admin Login</Title>
      <Form onSubmit={handleSubmit}>
        {/* <FormGroup>
          <Label htmlFor="adminname">Admin Name:</Label>
          <Input
            type="text"
            id="adminname"
            value={adminname}
            onChange={(e) => setAdminname(e.target.value)}
          />
        </FormGroup> */}
        <FormGroup>
          <Label htmlFor="email">Email:</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button type="submit">Login</Button>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </Form>
      {/* <div className="my-2"> <AdminSignup /></div> */}
   
    </Wrapper>
    </>
  );
};

export default AdminLogin;
