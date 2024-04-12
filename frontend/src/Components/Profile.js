import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Profile.css";
import { decodeToken } from "../Utils/auth";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(null); // State to store application status

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchApplicationStatus(); // Fetch application status data
  }, []);

  const fetchUserData = async () => {
    try {
      // console.log("Fetching user data..."); // Log 1: Fetching initiated

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }
      const decodedToken = decodeToken(token);
      const userId = decodedToken.userId;
      const response = await fetch("http://localhost:5000/user/user", {
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
      // console.log("Data fetched:", userData); // Log 2: Fetched data
      setUserData(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Log 3: Error encountered

      setError(error.message);
      setLoading(false);
    }
  };

  const fetchApplicationStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = decodeToken(token);
      const userId = decodedToken.userId;

      const response = await fetch(
        `http://localhost:5000/scholarship/checkApplicationStatus/${userId}`,
        {
          method: "GET",
          // headers: {
          //   Authorization: `Bearer ${token}`,
          //   "Content-Type": "application/json",
          // },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch application status");
      }

      const result = await response.json();
      console.log("API Response:", result);
      console.log("Application data:", result.userExists.data);
      if(result.userExists.exists){
        setApplicationStatus(result.userExists.data);
      }else{
        setApplicationStatus(null); 
      }
       // Update applicationStatus state
    } catch (error) {
      console.error("Error fetching application status:", error);
      setError(error.message);
    }
  };
  useEffect(() => {
    console.log("State applicationStatus", applicationStatus);
  }, [applicationStatus]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin"); // Redirect to signin page if user is not authenticated
    }
  }, [navigate]);

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    const token = localStorage.getItem("token");

    if (!file) {
      return; // No file selected, do nothing
    }

    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const response = await fetch(
        "http://localhost:5000/user/upload-profile-pic",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        // Profile picture uploaded successfully
        // Refresh user data to display updated profile picture
        fetchUserData();
      } else {
        throw new Error("Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError(error.message); // Set error state for display on frontend
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const replacedImgUrl = userData.profpic.replace(/\\/g, "/");
  const imageUrl = `../../../backend/${replacedImgUrl}`;
  const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
  // console.log(filename); // Output: profile_1712817276229.png

  // console.log(imageUrl);
  return (
    <div
      className="d-flex flex-column container border border-warning rounded text-center"
      style={{ marginBottom: "50px", marginTop: "20px" }}
    >
      <h1>Profile</h1>
      <hr />
      {/* {console.log(userData.profpic)} */}
      {}
      {userData && (
        <div className="d-flex flex-column">
          <div className="profpic">
            <img
              src={`http://localhost:5000/profile_images/${filename}`}
              alt="Profile Picture"
            />
          </div>

          <label htmlFor="profilePicInput" style={{ cursor: "pointer" }}>
            <span>
              <i className="fa-solid fa-pen-to-square"></i>
            </span>{" "}
            Edit Image
          </label>
          <input
            type="file"
            id="profilePicInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfilePicChange}
          />
          <div className="my-3">
            <div>
              <p>
                <b>Name:</b> {userData.name}
              </p>
            </div>
            <div>
              <p>
                <b>Email:</b> {userData.email}
              </p>
            </div>
          </div>
          <hr />
          <div>
            <h2 className="my-2">Scholarship Application Status</h2>
          {  console.log("State applicationStatus",applicationStatus)}
            {applicationStatus ? (
              <div className="my-4">
                <p><b>Application ID:</b> {applicationStatus.id}</p>
                <p><b>Status:</b> {applicationStatus.status}</p>
                <p><b>Remarks:</b> {applicationStatus.replyMessage}.....</p>
              </div>
            ) : (
              <p>No application submitted</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
