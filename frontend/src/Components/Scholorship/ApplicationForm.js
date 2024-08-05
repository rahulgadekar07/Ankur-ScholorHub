import React, { useState, useEffect, useRef } from "react";
import { decodeToken } from "../../Utils/auth";
import "../../Styles/ApplicationForm.css";
import ReactToPrint from "react-to-print";

const ApplicationForm = () => {
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  let userId = decodedToken.userId;
  // State variables to store user details
  const [loading, setLoading] = useState(true);
  const apiUrl=process.env.REACT_APP_URL;

  const [personalDetails, setPersonalDetails] = useState({});
  const [incomeDetails, setIncomeDetails] = useState({});
  const [educationDetails, setEducationDetails] = useState({});
  const [addressDetails, setAddressDetails] = useState({});
  const [documents, setDocuments] = useState([]);
  const [userData, setUserData] = useState(null);

  const componentRef = useRef(null);
  useEffect(() => {
    // Function to fetch personal details
    const fetchPersonalDetails = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/scholarship/getAllPersonalDetails/${userId}`
        ); // Assuming userId is available
        const data = await response.json();
        if (data[0]) {
          // Set personal details state if they exist
          setPersonalDetails(data[0]);
        }
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    // Function to fetch income details
    const fetchIncomeDetails = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/scholarship/getAllIncomeDetails/${userId}`
        );
        const data = await response.json();

        if (data[0]) {
          // Set income details state if they exist
          setIncomeDetails(data[0]);
        }
      } catch (error) {
        console.error("Error fetching income details:", error);
      }
    };

    // Function to fetch education details
    const fetchEducationDetails = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/scholarship/getAllEducationDetails/${userId}`
        );
        const data = await response.json();

        if (data[0]) {
          // Set education details state if they exist
          setEducationDetails(data[0]);
        }
      } catch (error) {
        console.error("Error fetching education details:", error);
      }
    };

    // Function to fetch address details
    const fetchAddressDetails = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/scholarship/getAllAddressDetails/${userId}`
        );
        const data = await response.json();
        if (data[0]) {
          // Set address details state if they exist
          setAddressDetails(data[0]);
        }
      } catch (error) {
        console.error("Error fetching address details:", error);
      }
    };

    // Function to fetch all documents
    const fetchAllDocuments = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/scholarship/getAllDocuments/${userId}`
        );
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    // Call the fetch functions
    fetchPersonalDetails();
    fetchIncomeDetails();
    fetchEducationDetails();
    fetchAddressDetails();
    fetchAllDocuments();
    fetchUserData();
  }, []); // Empty dependency array to run once on component mount

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }
      const decodedToken = decodeToken(token);
      const userId = decodedToken.userId;
      const response = await fetch(`${apiUrl}/user/getUserData`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token},userId=${userId}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setUserData(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  const replacedImgUrl =
    userData && userData.profpic ? userData.profpic.replace(/\\/g, "/") : "";
  const imageUrl = `../../../backend/${replacedImgUrl}`;
  const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  };
  
  return (
    <>
      <ReactToPrint
        trigger={() => (
          <button className="btn btn-success mt-2 mx-2">
            Print Application
          </button>
        )}
        content={() => componentRef.current}
      />
      <div ref={componentRef}>
        <div className="container   text-center">
          <h2 className="my-2 display-4 fw-bold">Application Form</h2>
          <hr />
          <div className="img  ">
            <img
              className=" rounded-pill mt-3 "
              src={`${apiUrl}/profile_images/${filename}`}
              alt="Profile Picture"
              style={{
                height: "100px",
                width: "100px",
                border: "1px dotted black",
              }}
            />
            <hr />
          </div>

          <div
            className="d-flex flex-column align-content-center my-3"
            id="printable-content"
          >
            <h3>Personal Details</h3>
            <p>
              <strong>Full Name:</strong> {personalDetails.fullname}
            </p>
            <p>
              <strong>Email:</strong> {personalDetails.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {personalDetails.mobile}
            </p>
            <p>
              <strong>Date of Birth:</strong> {formatDate(personalDetails.dob)}
            </p>

            <p>
              <strong>Gender:</strong> {personalDetails.gender}
            </p>

            <hr />

            <h3>Address Details</h3>
            <p>
              <strong>Permanent Address:</strong>{" "}
              {addressDetails.permanent_address}
            </p>
            <p>
              <strong>State:</strong> {addressDetails.permanent_state}
            </p>
            <p>
              <strong>District:</strong> {addressDetails.permanent_district}
            </p>
            <p>
              <strong>Taluka:</strong> {addressDetails.permanent_taluka}
            </p>
            <p>
              <strong>City:</strong> {addressDetails.permanent_city}
            </p>
            <p>
              <strong>Pin Code:</strong> {addressDetails.permanent_pincode}
            </p>

            <p>
              <strong>Current Address:</strong> {addressDetails.current_address}
            </p>
            <p>
              <strong>State:</strong> {addressDetails.current_state}
            </p>
            <p>
              <strong>District:</strong> {addressDetails.current_district}
            </p>
            <p>
              <strong>Taluka:</strong> {addressDetails.current_taluka}
            </p>
            <p>
              <strong>City:</strong> {addressDetails.current_city}
            </p>
            <p>
              <strong>Pin Code:</strong> {addressDetails.current_pincode}
            </p>

            <hr />

            <h3>Income Details</h3>
            <p>
              <strong>Parent Name:</strong> {incomeDetails.parentName}
            </p>
            <p>
              <strong>Parent Mobile:</strong> {incomeDetails.parentMobile}
            </p>
            <p>
              <strong>Job Type:</strong> {incomeDetails.jobType}
            </p>
            <p>
              <strong>Job Description:</strong> {incomeDetails.jobDescription}
            </p>
            <p>
              <strong>Annual Income (₹):</strong> {incomeDetails.annualIncome}
            </p>

            <hr />

            <h3>Education Details</h3>
            <p>
              <strong>Qualification:</strong> {educationDetails.qualification}
            </p>
            <p>
              <strong>Course/Degree Name:</strong>{" "}
              {educationDetails.course_name}
            </p>
            <p>
              <strong>Name of College/University:</strong>{" "}
              {educationDetails.institute}
            </p>
            <p>
              <strong>Current Studying Year:</strong>{" "}
              {educationDetails.current_year}
            </p>

            <hr />

            <h3>Uploaded Documents</h3>
            <div>
              {/* Render personalDetails documents */}
              {documents.personalDetails &&
                documents.personalDetails.map((documentUrl, index) => (
                  <div key={`personal_${index}`} className="my-2">
                    {/* Display link to open image in new tab */}
                    <a
                      href={`${apiUrl}/${documentUrl.replace(
                        /\\/g,
                        "/"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Adhaar Card
                    </a>
                  </div>
                ))}

              {/* Render incomeDetails documents */}
              {documents.incomeDetails &&
                documents.incomeDetails.map((documentUrl, index) => (
                  <div key={`income_${index}`} className="my-2">
                    {/* Display link to open image in new tab */}
                    <a
                      href={`${apiUrl}/${documentUrl.replace(
                        /\\/g,
                        "/"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Income Certificate
                    </a>
                  </div>
                ))}

              {/* Render educationDetails documents */}
              {documents.educationDetails &&
                documents.educationDetails.map((documentUrl, index) => (
                  <div key={`education_${index}`} className="my-2">
                    {/* Display link to open image in new tab */}
                    <a
                      href={`${apiUrl}/${documentUrl.replace(
                        /\\/g,
                        "/"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      College ID Card
                    </a>
                  </div>
                ))}
            </div>
            <hr />
          </div>
        </div>
        {/* Add space for manually adding date, place, and student signature */}
        <div className="manual-signature " style={{ margin: "4px 40px" }}>
          <p>
            <strong>Undertaking:</strong> I hereby declare that all the
            information provided in this application form is true and correct to
            the best of my knowledge and belief. I understand that any false
            statement made herein may lead to the rejection of my application or
            cancellation of any scholarship awarded to me.
          </p>

          <div>
            <label>Date:</label>
            <span>_____________</span>
          </div>
          <div>
            <label>Place:</label>
            <span>_________________________</span>
          </div>
          <div style={{ marginBottom: "70px" }}>
            <label>Student Signature:</label>
            <span>__________________________________</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationForm;
