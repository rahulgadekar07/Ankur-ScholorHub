import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch("http://localhost:5000/user/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin"); // Redirect to signin page if user is not authenticated
    }
  }, [navigate]);

  //endpoint for uploading profile picture
  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    console.log(file)
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("profilePic", file);
      console.log("FormData:", formData);

      const response = await fetch("http://localhost:5000/user/upload-profile-pic", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        body: formData,
      });

      if (response.ok) {
        // Profile picture uploaded successfully
        // Refresh user data to display updated profile picture
        fetchUserData();
      } else {
        throw new Error("Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="d-flex flex-column container border border-warning rounded text-center" style={{ marginBottom: '50px', marginTop: '20px' }}>
      <h1>Profile</h1>
      {userData && (
        <div className="d-flex flex-column">
          <div className="profpic">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA6g9BWr61gs6KYIq3zjFEy36Z8OuOIJQ75A&usqp=CAU" alt="ERROR" />
            <label htmlFor="profilePicInput" style={{ cursor: 'pointer' }}>
              <span><i className="fa-solid fa-pen-to-square"></i></span> Edit Image
            </label>
            <input
              type="file"
              id="profilePicInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfilePicChange}
            />
          </div>
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
      )}
    </div>
  );
};

export default Profile;
