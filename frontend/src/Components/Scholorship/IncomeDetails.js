import React, { useEffect, useState } from "react";
import { decodeToken } from "../../Utils/auth";
import { useNavigate } from "react-router-dom";
import PopupAlert from "../../Components/Alerts/PopupAlert";
import ConfirmBox from '../Alerts/ConfirmBox';

const IncomeDetails = (props) => {
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);

  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const apiUrl=process.env.REACT_APP_URL;

  const [alertSettings, setAlertSettings] = useState({
    type: "warning",
    message: "alert message",
  });
  const [incomeError, setIncomeError] = useState("");
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  const checkIncomeDetails = async () => {
    try {
      const userId = decodedToken.userId;

      const response = await fetch(
        `${apiUrl}/scholarship/checkIncomeDetails/${userId}`
      );
      const data = await response.json();
      if (data.detailsExist1) {
        setShowAlert(true);
        setAlertSettings({
          type: "failure",
          message: "Already saved Income Details",
        });
        // Redirect to dashboard or any other page
      }
    } catch (error) {
      console.error("Error checking user details:", error);
    }
  };

  useEffect(() => {
    checkIncomeDetails();
  }, []);

  // Sample job options
  const jobOptions = [
    { value: "", label: "Select Occupation" },
    { value: "job", label: "Job" },
    { value: "business", label: "Business" },
    { value: "others", label: "Others" },
  ];

  const [formData, setFormData] = useState({
    parentName: "",
    parentMobile: "",
    jobType: "",
    jobDescription: "",
    annualIncome: "",
    incomeCertificate: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "annualIncome") {
      if (parseFloat(value) > 300000) {
        setIncomeError("Income cannot exceed ₹300,000");
        setIsSaveDisabled(true);
      } else {
        setIncomeError("");
        setIsSaveDisabled(false);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      incomeCertificate: file,
    });
  };
  const handleConfirmBox=(e)=>{
    e.preventDefault();
  
    setShowConfirmBox(true)
  }
  const handleSubmit = async (confirm) => {
    
    if (confirm) {
      const formDataToSend = new FormData();
      formDataToSend.append("userId", decodedToken.userId);
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      try {
        const response = await fetch(
          `${apiUrl}/scholarship/applyId`,
          {
            method: "POST",
            body: formDataToSend,
          }
        );
        if (response.ok) {
          setAlertSettings({
            type: "success",
            message: "Income Details Saved Successfully",
          });
          setShowAlert(true);
          // Reset the form after successful submission
          setFormData({
            parentName: "",
            parentMobile: "",
            jobType: "",
            jobDescription: "",
            annualIncome: "",
            incomeCertificate: null,
          });
        } else {
          throw new Error("Failed to save income details");
        }
      } catch (error) {
        console.error("Error saving income details:", error);
        alert("Error saving income details");
      }
    }

  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    props.setActiveSection("education-details");
    props.setbgcolor3(true);
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
          onClose={handleCloseAlert}
        />
      )}
      <h2>Income Details:</h2>
      <hr />
      {!showAlert && (
        <form
          className="income-details-form d-flex flex-column"
          onSubmit={handleConfirmBox}
        >
          {/* Parent Information */}
          <div className="form-group">
            <label htmlFor="parentName">Parent Name</label>
            <input
              type="text"
              className="form-control"
              id="parentName"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              placeholder="Enter Parent Name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="parentMobile">Parent Mobile</label>
            <input
              type="tel"
              className="form-control"
              id="parentMobile"
              name="parentMobile"
              value={formData.parentMobile}
              onChange={handleChange}
              placeholder="Enter Parent Mobile"
              required
            />
          </div>

          {/* Job Information */}
          <div className="form-group">
            <label htmlFor="jobType">Occupation</label>
            <select
              className="form-select"
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
            >
              {jobOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Job Description */}
          <div className="form-group">
            <label htmlFor="jobDescription">Job Description</label>
            <input
              type="text"
              className="form-control"
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Enter Job Description"
            />
          </div>

          {/* Income Information */}
          <label htmlFor="annualIncome" className="my-1">
             <b>(₹) Annual Income</b>
          </label>
          <div className="form-group d-flex my-2">
            <div className="input-group ms-2">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control"
                id="annualIncome"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                aria-label="Annual Income (in rupees)"
                placeholder="Enter Annual Income"
                required
              />
              <span className="input-group-text">.00</span>
            </div>
          </div>
          {incomeError && <div className="text-danger my-2 ">{incomeError}</div>}

          {/* Income Certificate */}
          <div className="form-group">
            <label htmlFor="incomeCertificate">Income Certificate</label>
            <input
              type="file"
              className="form-control"
              id="incomeCertificate"
              name="incomeCertificate"
              onChange={handleFileChange}
            />
          </div>

          {/* Form Buttons */}
          <div className="buttons my-3 d-flex flex-column">
            <button type="submit" className="btn btn-success my-2" disabled={isSaveDisabled}>
              Save
            </button>
            <button type="reset" className="btn btn-danger my-1">
              Clear
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default IncomeDetails;
