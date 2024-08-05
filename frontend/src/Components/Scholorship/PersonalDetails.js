//PersonalDetails.js
import React, { useEffect, useState } from "react";
import { decodeToken } from "../../Utils/auth";
import { useNavigate } from "react-router-dom";
import PopupAlert from "../../Components/Alerts/PopupAlert";
import ConfirmBox from '../Alerts/ConfirmBox';

const PersonalDetails = (props) => {
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    type: "warning",
    message: "alert message",
  });
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const apiUrl=process.env.REACT_APP_URL;

  const navigate = useNavigate();
  // Update email value in state when signing in with a new account
  // Initialize default email using decoded token
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    aadharCard: null,
  });

  const checkPersonalDetails = async () => {
    try {
      const userId = decodedToken.userId;

      const response = await fetch(
        `${apiUrl}/scholarship/checkPersonalDetails/${userId}`
      );
      const data = await response.json();

      if (data.detailsExist) {
        setShowAlert(true);
        setAlertSettings({
          type: "failure",
          message: "Already saved Personal Details",
        });
        // Redirect to the next section
      }
    } catch (error) {
      console.error("Error checking user details:", error);
    }
  };

  useEffect(() => {
    checkPersonalDetails();
  }, []);

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
const handleConfirmBox=(e)=>{
  e.preventDefault();

  setShowConfirmBox(true)
}

  const handleSubmit = async (confirmed) => {
    if(confirmed){
   
   
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
        const response = await fetch(
          `${apiUrl}/scholarship/applyPd`,
          {
            method: "POST",
            body: form,
          }
        );
        console.log(response);
        if (response.ok) {
          console.log("Personal details saved successfully");
         
          setAlertSettings({
            type: "success",
            message: "Personal Details Saved Successfully",
          });
          setShowAlert(true);
          setApplicationSubmitted(true); // Update applicationSubmitted when the form is successfully submitted

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
    
    setShowConfirmBox(false)
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
    props.setActiveSection("address-details");
    props.setbgcolor1(true)
  };
  return (
    <>
    {showConfirmBox && (
        <ConfirmBox
          message="Are you Sure you want to Save ? Once Saved you wont be able to Edit the details"
          onConfirm={handleSubmit}
        />
      )}
      {showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert} // Pass function reference here
        />
      )}
      <h2>Personal Details:</h2>
      <hr />

      <div className="pdetails">
        {!showAlert && (
          <form className="d-flex flex-column" onSubmit={handleConfirmBox}>
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
        )}
      </div>
    </>
  );
};

export default PersonalDetails;
