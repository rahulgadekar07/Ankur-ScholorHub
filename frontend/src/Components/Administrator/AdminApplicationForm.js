import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import ReactToPrint from "react-to-print";
import "../../Styles/ApplicationForm.css";

const AdminApplicationForm = () => {
  // Get the location object using useLocation
  const location = useLocation();
  const apiUrl=process.env.REACT_APP_URL;

  // Parse the query string to get the userId
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('userId');

  console.log(userId); // Should print the userId
  const [loading, setLoading] = useState(true);

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
        // console.log("Personal Details Data:", data);
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
        // console.log("Education Details Data:", data);

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
        console.log("Data:- ", data);
        setDocuments(data);
        console.log("Fetched Documents Data:", data);
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
      // console.log("Fetching user data..."); // Log 1: Fetching initiated

    
      const response = await fetch(`${apiUrl}/user/getUserData?userId=${userId}`, {
        method: "GET",
        headers: {
         
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      console.log("Data fetched:", userData); // Log 2: Fetched data
      setUserData(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Log 3: Error encountered

      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  console.log("userData in APF:- ", userData);
  // Check if userData is not null before accessing its properties
  const replacedImgUrl =
    userData && userData.profpic ? userData.profpic.replace(/\\/g, "/") : "";
  const imageUrl = `../../../backend/${replacedImgUrl}`;
  const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

  console.log("documentssssssssssss:- ", documents);
  const { personalDetails1, incomeDetails1, educationDetails1 } = documents;

  const personalDetailsUrls = documents.personalDetails || [];
  const incomeDetailsUrls = documents.incomeDetails || [];
  const educationDetailsUrls = documents.educationDetails || [];
  console.log(personalDetailsUrls[0]);
  return (
    <>
    <ReactToPrint
      trigger={() => (
        <button className="btn btn-success mt-2 mx-2     ">
          Print Application
        </button>
      )}
      content={() => componentRef.current}
    />
    <div
      className="container text-center"
      style={{ marginBottom: "50px" }}
      ref={componentRef}
    >
      <h2 className="my-2 display-4 fw-bold">Application Form</h2>
      <div className="img">
        <img
          className="rounded-pill mt-3 "
          src={`${apiUrl}/profile_images/${filename}`}
          alt="Profile Picture"
          style={{ height: "200px", width: "200px" }}
        />
      </div>

      <div
        className="d-flex flex-column align-content-center my-3"
        id="printable-content"
      >
        <div className="scholarship-summary">
          <div className="row">
            <div className="col my-3">
              <h3>Personal Details:- </h3>
              <table className="table table-striped table-bordered">
                <tbody>
                  <tr>
                    <th scope="row">Full Name</th>
                    <td>{personalDetails.fullname}</td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>{personalDetails.email}</td>
                  </tr>
                  <tr>
                    <th scope="row">Phone Number</th>
                    <td>{personalDetails.mobile}</td>
                  </tr>
                  <tr>
                    <th scope="row">Date of Birth</th>
                    <td>{personalDetails.dob}</td>
                  </tr>
                  <tr>
                    <th scope="row">Gender</th>
                    <td>{personalDetails.gender}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col my-3">
              <h3>Income Details:- </h3>
              <table className="table table-striped table-bordered">
                <tbody>
                  <tr>
                    <th scope="row">Parent Name</th>
                    <td>{incomeDetails.parentName}</td>
                  </tr>
                  <tr>
                    <th scope="row">Parent Mobile</th>
                    <td>{incomeDetails.parentMobile}</td>
                  </tr>
                  <tr>
                    <th scope="row">Job Type</th>
                    <td>{incomeDetails.jobType}</td>
                  </tr>
                  <tr>
                    <th scope="row">Job Description</th>
                    <td>{incomeDetails.jobDescription}</td>
                  </tr>
                  <tr>
                    <th scope="row">Annual Income (₹)</th>
                    <td>{incomeDetails.annualIncome}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="row">
            <div className="col my-3">
              <h3>Education Details:- </h3>
              <table className="table table-striped table-bordered">
                <tbody>
                  <tr>
                    <th scope="row">Qualification</th>
                    <td>{educationDetails.qualification}</td>
                  </tr>
                  <tr>
                    <th scope="row">Course/Degree Name</th>
                    <td>{educationDetails.course_name}</td>
                  </tr>
                  <tr>
                    <th scope="row">Name of College/University</th>
                    <td>{educationDetails.institute}</td>
                  </tr>
                  <tr>
                    <th scope="row">Current Studying Year</th>
                    <td>{educationDetails.current_year}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3>Address Details:- </h3>
            <div className="col my-3">
              <table className="table table-striped table-bordered">
                <tbody>
                  <tr>
                    <th scope="row">Permanent Address</th>
                    <td>{addressDetails.permanent_address}</td>
                  </tr>
                  <tr>
                    <th scope="row">State</th>
                    <td>{addressDetails.permanent_state}</td>{" "}
                  </tr>
                  <tr>
                    <th scope="row">District</th>
                    <td>{addressDetails.permanent_district}</td>{" "}
                  </tr>
                  <tr>
                    <th scope="row">Taluka</th>
                    <td>{addressDetails.permanent_taluka}</td>{" "}
                  </tr>
                  <tr>
                    <th scope="row">City</th>
                    <td>{addressDetails.permanent_city}</td>{" "}
                  </tr>
                  <tr>
                    <th scope="row">Pin Code</th>
                    <td>{addressDetails.permanent_pincode}</td>{" "}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col my-3">
              <table className="table table-striped table-bordered">
                <tbody>
                  <tr>
                    <th scope="row">Current Address</th>
                    <td>{addressDetails.current_address}</td>
                  </tr>
                  <tr>
                    <th scope="row">State</th>
                    <td>{addressDetails.current_state}</td>{" "}
                  </tr>
                  <tr>
                    <th scope="row">District</th>
                    <td>{addressDetails.current_district}</td>{" "}
                  </tr>
                  <tr>
                    <th scope="row">Taluka</th>
                    <td>{addressDetails.current_taluka}</td>{" "}
                  </tr>
                  <tr>
                    <th scope="row">City</th>
                    <td>{addressDetails.current_city}</td>{" "}
                  </tr>
                  <tr>
                    <th scope="row">Pin Code</th>
                    <td>{addressDetails.current_pincode}</td>{" "}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <h3> Uploaded Documents:- </h3>
        <div>
          <div>
            {/* Render personalDetails documents */}
            {documents.personalDetails &&
              documents.personalDetails.map((documentUrl, index) => (
                <div key={`personal_${index}`}  className="my-2">
                  {/* Display link to open image in new tab */}
                  <a
                    href={`${apiUrl}/${documentUrl.replace(
                      /\\/g,
                      "/"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Show Adhaar Card
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
                   Show Income Certificate 
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
                    Show College ID Card
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default AdminApplicationForm;
