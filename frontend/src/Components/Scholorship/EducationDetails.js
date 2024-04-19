import React, { useState,useEffect } from "react";
import { decodeToken } from "../../Utils/auth";
import { useNavigate } from "react-router-dom";
import Spinner from "../Alerts/Spinner";


const EducationDetails = (props) => {
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  let userId = decodedToken.userId;
  let emailtosend=decodedToken.email;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    qualification: "",
    courseName: "",
    institute: "",
    currentYear: "",
    idCard: null,
  });
  const navigate = useNavigate();

  const checkEducationDetails = async () => {
    try {
      const userId = decodedToken.userId;

      const response = await fetch(
        `http://localhost:5000/scholarship/checkEducationDetails/${userId}`
      );
      const data = await response.json();
      if (data.detailsExist3) {
        alert("You have already submitted your Education details.");
        navigate("/"); // Redirect to dashboard or any other page
      }
    } catch (error) {
      console.error("Error checking user details:", error);
    }
  };

  useEffect(() => {
    checkEducationDetails();
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      idCard: file,
    });
  };
  console.log("Email to send:",emailtosend)

  const handleSubmit = async (e) => {
    e.preventDefault();

    let conf = window.confirm(
      "Are you Sure you want to Save ? Once Saved you wont be able to Edit the details"
    );
    if (conf) {
      setLoading(true)
      
      // Append userId to the formData
      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("email", emailtosend);
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      try {
        const response = await fetch(
          "http://localhost:5000/scholarship/applyEd",
          {
            method: "POST",
            body: formDataToSend,
          }
        );
        console.log("Formdata:- ",formData)
        if (response.ok) {
          setLoading(false)
          alert("Education details saved successfully");

          props.setbgcolor4(true);
          
          // Optionally, reset the form
          setFormData({
            qualification: "",
            courseName: "",
            institute: "",
            currentYear: "",
            idCard: null,
          });
          navigate("/")
        } else {
          setLoading(false)

          throw new Error("Failed to save education details");
        }
      } catch (error) {
        setLoading(false)

        console.error("Error saving education details:", error);
        alert("Error saving education details");
      }
    }
  };

  return (
    <>
      <h2>Education Details:</h2>
      <hr />
      <form
        className="education-details-form d-flex flex-column "
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="qualification">Qualification</label>
          <select
            className="form-select"
            id="qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Graduation">Graduation</option>
            <option value="Post Graduation">Post Graduation</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="courseName">Course/Degree Name</label>
          <input
            type="text"
            className="form-control"
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="institute">Name of College/University</label>
          <input
            type="text"
            className="form-control"
            id="institute"
            name="institute"
            value={formData.institute}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="currentYear">Current Studying Year</label>
          <input
            type="number"
            className="form-control"
            id="currentYear"
            name="currentYear"
            value={formData.currentYear}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="idCard">ID Card of the Institute</label>
          <input
            type="file"
            className="form-control"
            id="idCard"
            name="idCard"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="buttons my-3 d-flex flex-column">
          <button type="submit" className="btn btn-success my-2">
            Save
          </button>
          <button type="reset" className="btn btn-danger my-2">
            Clear
          </button>
          {loading && <Spinner/>}
        </div>
      </form>
    </>
  );
};

export default EducationDetails;
