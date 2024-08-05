import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Profile.css";
import { decodeToken } from "../Utils/auth";
import Spinner from "./Alerts/Spinner";
import { NewsStripContext } from "../Contexts/NewsStripContext";
import ConfirmBox from "./Alerts/ConfirmBox";
import PopupAlert from '../Components/Alerts/PopupAlert';

const Profile = () => {
  const apiUrl = process.env.REACT_APP_URL;
  const { isNewsStripVisible } = useContext(NewsStripContext);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    type: 'warning',
    message: 'alert message',
  });
  const navigate = useNavigate();

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const checkUserQuizStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = decodeToken(token);
      const userId = decodedToken.userId;

      const response = await fetch(`${apiUrl}/quiz/checkUserQuizStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const { hasSubmittedQuiz } = await response.json();
        if (hasSubmittedQuiz) {
          setIsSubmitted(true);
        }
      }
    } catch (error) {
      console.error("Error checking user quiz status:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    checkUserQuizStatus();
    fetchApplicationStatus();
  }, []);

  const handleDelete = () => {
    setMessage("Are you sure you want to delete this application?");
    setShowConfirmBox(true);
  };

  const handleConfirm = async (confirmed) => {
    if (confirmed) {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = decodeToken(token);
        const userId = decodedToken.userId;

        const response = await fetch(
          `${apiUrl}/scholarship/deleteApplication/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete application");
        }
        setShowAlert(true);
        setAlertSettings({
          type: 'success',
          message: 'Application Deleted Successfully! ',
        });
        setApplicationStatus(null);
      } catch (error) {
        console.error("Error Deleting Form:", error);
      }
    }
    setShowConfirmBox(false);
  };

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
        `${apiUrl}/scholarship/checkApplicationStatus/${userId}`,
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

      const response = await fetch(`${apiUrl}/user/upload-profile-pic`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

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
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const replacedImgUrl = userData ? userData.profpic.replace(/\\/g, "/") : "";
  const imageUrl = `../../../backend/${replacedImgUrl}`;
  const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

  const handleShowResult = () => {
    navigate("/results");
  };

  return (
    <div
      className="d-flex flex-column container border border-warning rounded text-center animate__fadeInUp"
      style={{ marginBottom: "50px", marginTop: "20px" }}
    >
       {showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert}
        />
      )}
      {showConfirmBox && (
        <ConfirmBox message={message} onConfirm={handleConfirm} />
      )}
      <h1 className="my-3">Profile</h1>
      <hr />
      {userData && (
        <div className="d-flex flex-column">
          <div className="profpic">
            <img
              src={`http://localhost:5000/profile_images/${filename}`}
              alt="Profile Picture"
              style={{ height: "200px", width: "200px" }}
              className="animate__fadeInDown"
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
            {applicationStatus ? (
              <div className="my-4">
                <p>
                  <b>Application ID:</b> {applicationStatus.id}
                </p>
                <p>
                  <b>Status:</b>{" "}
                  <span
                    className={`application-status ${
                      applicationStatus.status === "approved"
                        ? "text-success animate__fadeIn"
                        : "text-danger animate__shakeX"
                    }`}
                  >
                    {applicationStatus.status}
                  </span>
                </p>
                <p>
                  <b>Remarks:</b>{" "}
                  <span
                    className={`application-status ${
                      applicationStatus.status === "approved"
                        ? "text-success animate__fadeIn"
                        : "text-danger animate__shakeX"
                    }`}
                  >
                    {applicationStatus.replyMessage}
                  </span>
                  .....
                </p>
                <Link className="btn btn-primary mx-1" to="/printform">
                  View Form
                </Link>
                <button
                  className="btn btn-danger mx-1 animate__fadeInUp"
                  onClick={handleDelete}
                >
                  Delete Application
                </button>
                {applicationStatus.status === "approved" && (
                  <Link
                    className={`btn btn-success mx-1 ${
                      isSubmitted ? "disabled-link" : ""
                    }`}
                    to="/display-quiz"
                    disabled={isSubmitted}
                  >
                    Give Test
                  </Link>
                )}
                {isSubmitted && !isNewsStripVisible && (
                  <p className="text-danger my-2">
                    You Have Submitted Quiz...Kindly Wait for Results
                  </p>
                )}
                {isSubmitted && isNewsStripVisible && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleShowResult}
                  >
                    Show Result
                  </button>
                )}
              </div>
            ) : (
              <p className="text-danger">No any application submitted...</p>
            )}
          </div>
          <hr />
        </div>
      )}
    </div>
  );
};

export default Profile;
