//PersonalDetails.js
import React, { useEffect, useState } from "react";
import { decodeToken } from "../../Utils/auth";
import { useNavigate } from "react-router-dom";

const PersonalDetails = (props) => {
  
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    aadharCard: null,
  });

  const navigate=useNavigate()
  // Update email value in state when signing in with a new account
  // Initialize default email using decoded token
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const [defaultEmail, setDefaultEmail] = useState(
    decodedToken ? decodedToken.email : ""
  );
  let dfemail = defaultEmail;
  // Update default email when token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = decodeToken(token);
    if (decodedToken) {
      setDefaultEmail(decodedToken.email);
      setFormData({ ...formData, email: decodedToken.email }); // Update formData.email
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, aadharCard: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   let conf= window.confirm("Are you Sure you want to Save ? Once Saved you wont be able to Edit the details");
   if (conf){
    console.log("Form Data before submission: ", formData);
    const form = new FormData();
    form.append("userId", decodedToken.userId);
    form.append("fullname", formData.fullname);
    form.append("email", formData.email);
    form.append("mobile", formData.mobile);
    form.append("dob", formData.dob);
    form.append("gender", formData.gender);
    form.append("aadharCard", formData.aadharCard);
    console.log(formData);
    try {
      const response = await fetch("http://localhost:5000/scholarship/applyPd", {
        method: "POST",
        body: form,
      });
      console.log(response);
      if (response.ok) {
        console.log("Personal details saved successfully");
        props.setbgcolor1(true)

        alert("Personal Details Saved SuccessFully")
        props.setActiveSection("address-details")
        // Add logic to handle successful submission
      } else {
        console.error("Failed to save personal details");
        // Add logic to handle failed submission
      }
    } catch (error) {
      console.error("Error saving personal details:", error);
      // Add logic to handle error
    }
   }
    
  };

  return (
    <>
      <h2>Personal Details:</h2>
      <hr />
    <div className="pdetails">
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <div className="form-group my-2">
          <label htmlFor="fullname">Name:</label>
          <input
            type="text"
            className="form-control"
            id="fullname"
            name="fullname"
            placeholder="Enter Full Name"
            value={formData.fullname}
            onChange={handleChange}
          />
        </div>
        <div className="form-group my-2">
          <label htmlFor="email1">Email address:</label>
          <input
            type="email"
            className="form-control"
            id="email1"
            name="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={defaultEmail || formData.email} // Use defaultValue only
            onChange={handleChange} // Ensure handleChange updates the email field
          />

          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group my-2">
          <label htmlFor="mobile">Password:</label>
          <input
            type="number"
            className="form-control"
            id="mobile"
            name="mobile"
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        <div className="form-group my-2">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            className="form-control"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>
        <div className="gender d-flex my-2">
          <label>Gender:</label>
          <div className="form-check mx-2">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="male"
              value="male"
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="male">
              Male
            </label>
          </div>
          <div className="form-check mx-2">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="female"
              value="female"
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="female">
              Female
            </label>
          </div>
          <div className="form-check mx-2">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="other"
              value="other"
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="other">
              Other
            </label>
          </div>
        </div>
        <div className="form-group my-2">
          <label htmlFor="aadharCard">Upload Aadhar Card (JPG file):</label>
          <input
            type="file"
            className="form-control"
            id="aadharCard"
            name="aadharCard"
            accept="image/jpeg"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-success my-2">
          Save
        </button>

        <button type="reset" className="btn btn-danger my-1">
          Clear
        </button>
      </form>
    </div>
    </>
  );
};

export default PersonalDetails;
