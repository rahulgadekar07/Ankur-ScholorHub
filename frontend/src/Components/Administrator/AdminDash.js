import React, { useState, useEffect } from "react";
import "../../Styles/AdminDash.css";
import AdminSignup from "./AdminSignUp";
import { useAdminAuth } from "../../Contexts/AdminAuthContext";
import { decodeAdminToken } from "../../Utils/adminAuth"; // Import decodeAdminToken function
import { useNavigate } from "react-router-dom";
import DisplayUsers from "./DisplayUsers";
import DisplayDonors from "./DisplayDonors";
import Quiz from "./Quiz";
import ManageScholorship from "./ManageScholorship";
import QuizResult from "./QuizResult";
import DisplayFeedback from "./DisplayFeedback";

const AdminDash = () => {

  const { adminSignIn, isAdminAuthenticated, adminSignOut } = useAdminAuth();
  const [adminToken, setadminToken] = useState(
    localStorage.getItem("adminToken")
  );
  const [adminName, setAdminName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("manage-users"); // State to track active menu
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminToken) {
      alert("Admin is not signed in");
      navigate("/admin");
    } else {
      // Decode the token to get admin details
      const decodedToken = decodeAdminToken(adminToken);
      console.log("adtoken:", adminToken);
      console.log("Decoded Token:", decodedToken); // Log decoded token for inspection

      if (decodedToken) {
        setAdminName(decodedToken.adminName);
      }
    }
  }, [adminToken]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSignOut = () => {
    adminSignOut();
    setAdminName(""); // Clear admin name
    setadminToken(null); // Clear admin token
    localStorage.removeItem("adminToken");
    navigate("/admin");
    // Remove token from local storage
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between  heading1">
        <AdminSignup
          isOpen={isOpen}
          openModal={openModal}
          closeModal={closeModal}
        />
        <h1>Admin Dashboard</h1>
        <div className="dropdown">
          <button
            className="btn btn-sm btn-link text-white text-decoration-none dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <b>Admin:- {adminName}</b>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <button className="dropdown-item" onClick={handleSignOut}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="container1">
        <div className="menu1">
          <h3 id="adminh3" className="m-2 text-center ">
            Admin Navigation
          </h3>
          <hr
            style={{
              border: "none",
              borderTop: " 1px solid #ffffff" /* White line color */,
              margin: "10px 0",
            }}
          />
          <div
            className={`menu-item text-center ${
              activeMenu === "manage-users" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("manage-users")}
          >
            Manage Users
          </div>
          <hr className="adhr" />
          <div
            className={`menu-item text-center ${
              activeMenu === "manage-scholorship" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("manage-scholorship")}
          >
            Manage Scholorship
          </div>
          <hr className="adhr" />
          <div
            className={`menu-item text-center ${
              activeMenu === "manage-quiz" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("manage-quiz")}
          >
            Manage Aptitude Test
          </div>
          <hr className="adhr" />
          <div
            className={`menu-item text-center ${
              activeMenu === "manage-quizresult" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("manage-quizresult")}
          >
            Manage Test Results
          </div>
          <hr className="adhr" />
          <div
            className={`menu-item text-center ${
              activeMenu === "manage-donors" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("manage-donors")}
          >
            Manage Donors
          </div>
          <hr className="adhr" />
          <div
            className={`menu-item text-center ${
              activeMenu === "manage-feedback" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("manage-feedback")}
          >
            Manage Feedbacks
          </div>

         
         
          <hr className="adhr" />
        </div>
        <div className="aside" style={{marginBottom:'50px',padding:'30px 30px',backgroundColor:'lightgray'}}>
          {activeMenu === "manage-users" && <DisplayUsers />}
          {activeMenu === "manage-donors" && <DisplayDonors />}
          {activeMenu === "manage-quiz" && <Quiz />}
          {activeMenu === "manage-scholorship" && <ManageScholorship />}
          {activeMenu === "manage-quizresult" && <QuizResult />}
          {activeMenu === "manage-feedback" && <DisplayFeedback/>}
        </div>
      </div>
    </>
  );
};

export default AdminDash;
