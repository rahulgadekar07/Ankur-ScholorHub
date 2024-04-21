import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const handleDelete = async () => {
    let confdelete = window.confirm(
      "Are You Sure you want to Delete Application Form?"
    );
    if (confdelete) {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = decodeToken(token);
        const userId = decodedToken.userId;

        const response = await fetch(
          `http://localhost:5000/scholarship/deleteApplication/${userId}`,
          {
            method: "DELETE", // Change the method to DELETE
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete application");
        }
        alert("Scholorship Application Deleted Successfully..!!");
        // Application deleted successfully
        setApplicationStatus(null); // Clear the application status in state
      } catch (error) {
        console.error("Error Deleting Form:", error);
        // Handle error
      }
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }
      const decodedToken = decodeToken(token);
      const userId = decodedToken.userId;
      const response = await fetch("http://localhost:5000/user/getUserData", {
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
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch application status");
      }

      const result = await response.json();
      if (result.userExists.exists) {
        setApplicationStatus(result.userExists.data);
      } else {
        setApplicationStatus(null);
      }
    } catch (error) {
      console.error("Error fetching application status:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    const token = localStorage.getItem("token");

    if (!file) {
      return;
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
        fetchUserData();
        window.location.reload();
      } else {
        throw new Error("Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const replacedImgUrl = userData ? userData.profpic.replace(/\\/g, "/") : "";
  const imageUrl = `../../../backend/${replacedImgUrl}`;
  const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

  return (
    <div className="d-flex flex-column container border border-warning rounded text-center animate__fadeInUp" style={{ marginBottom: "50px", marginTop: "20px" }}>
      <h1 className="my-3">Profile</h1>
      <hr />
      {userData && (
        <div className="d-flex flex-column">
          <div className="profpic">
            <img src={`http://localhost:5000/profile_images/${filename}`} alt="Profile Picture" style={{ height: "200px", width: "200px" }} className="animate__fadeInDown" />
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
            {applicationStatus ? (
              <div className="my-4">
                <p>
                  <b>Application ID:</b> {applicationStatus.id}
                </p>
                <p>
                  <b>Status:</b>{" "}
                  <span className={`application-status ${applicationStatus.status === 'approved' ? 'text-success animate__fadeIn' : 'text-danger animate__shakeX'}`}>
                    {applicationStatus.status}
                  </span>
                </p>
                <p>
                  <b>Remarks:</b>{" "}
                  <span className={`application-status ${applicationStatus.status === 'approved' ? 'text-success animate__fadeIn' : 'text-danger animate__shakeX'}`}>
                    {applicationStatus.replyMessage}
                  </span>
                  .....
                </p>
                <Link className="btn btn-primary mx-1" to="/printform">
                  {" "}
                  View Form{" "}
                </Link>
                <button
                  className="btn btn-danger mx-1 animate__fadeInUp"
                  onClick={handleDelete}
                >
                  Delete Application
                </button>
              </div>
            ) : (
              <p className="text-danger ">No any application submitted...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
