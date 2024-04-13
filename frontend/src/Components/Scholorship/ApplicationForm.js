import React, { useState, useEffect, useRef } from "react";
import { decodeToken } from "../../Utils/auth";
import "../../Styles/ApplicationForm.css"
import ReactToPrint from "react-to-print";

const ApplicationForm = () => {
    const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  let userId = decodedToken.userId;
  // State variables to store user details
  const [personalDetails, setPersonalDetails] = useState({});
  const [incomeDetails, setIncomeDetails] = useState({});
  const [educationDetails, setEducationDetails] = useState({});
  const [addressDetails, setAddressDetails] = useState({});
  const componentRef = useRef(null);

  useEffect(() => {
    // Function to fetch personal details
    const fetchPersonalDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/scholarship/getAllPersonalDetails/${userId}`); // Assuming userId is available
        const data = await response.json();
        console.log("Personal Details Data:", data); 
        if (data[0] ) {
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
        const response = await fetch(`http://localhost:5000/scholarship/getAllIncomeDetails/${userId}`);
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
        const response = await fetch(`http://localhost:5000/scholarship/getAllEducationDetails/${userId}`);
        const data = await response.json();
        console.log("Education Details Data:", data); 

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
        const response = await fetch(`http://localhost:5000/scholarship/getAllAddressDetails/${userId}`);
        const data = await response.json();
        if (data[0]) {
          // Set address details state if they exist
          setAddressDetails(data[0]);
        }
      } catch (error) {
        console.error("Error fetching address details:", error);
      }
    };
    

    // Call the fetch functions
    fetchPersonalDetails();
    fetchIncomeDetails();
    fetchEducationDetails();
    fetchAddressDetails();
  }, []); // Empty dependency array to run once on component mount
 
// Function to trigger printing
// const handlePrint = () => {
//     window.print(); // Trigger the browser's print dialog
//   };
  return (
    <>
    <ReactToPrint
    trigger={() => <button className="btn btn-success m-2    ">Print Application</button>}
    content={() => componentRef.current}
  />
    <div className="container text-center" style={{ marginBottom: "50px" }} ref={componentRef}>
    
      <h2 className="my-4 display-4 fw-bold">Application Form</h2>
    
      <div className="d-flex flex-column align-content-center my-3" id="printable-content"  >
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
      </div>
      
    </div>
    </>
  );
};

export default ApplicationForm;
