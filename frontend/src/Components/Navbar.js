import React, { useState, useEffect } from "react";
import "../Styles/Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SignInModal from "./Modals/SignInModal";
import SignUpModal from "./Modals/SignUpModal";
import { useAuth } from "../Contexts/authContext";
import Formpage from "./Scholorship/Formpage";
import { decodeToken } from "../Utils/auth";

function Navbar() {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const location = useLocation(); // Get current location
  const isAdminDash = location.pathname === "/admindash";

  useEffect(() => {
    // Check if the user is already authenticated based on the token stored in local storage
    const token = localStorage.getItem("token");
    if (token) {
      setAuthenticated(true);

      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setUserName(decodedToken.email ?? "");
        // Assuming the token contains the user's ID
      }
    }
  }, []);

  const toggleSignInModal = () => {
    setShowSignInModal(!showSignInModal);
  };

  const toggleSignUpModal = () => {
    setShowSignUpModal(!showSignUpModal);
  };

  const handleSignOut = () => {
    let conf = window.confirm("Are you sure to Logout?");
    if (conf) {
      // Clear the token from local storage and set authenticated to false
      localStorage.removeItem("token");
      signOut();
      setAuthenticated(false);
      navigate("/");
      setUserName("");
    }
  };

  return (
    <>
      {!isAdminDash && (
        <div className="navbar1">
          <div className="navbar1-left">
            <i className="fa-solid fa-envelope mx-1 "></i>
            <span>ankurfoundation@gmail.com</span>
          </div>
          <div className="navbar1-right">
            {authenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-link text-white text-decoration-none dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {userName}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleSignOut}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <button
                  className="btn btn-sm btn-link text-white text-decoration-none"
                  onClick={toggleSignUpModal}
                >
                  SignUp
                </button>
                <button
                  className="btn btn-sm btn-link text-white text-decoration-none"
                  onClick={toggleSignInModal}
                >
                  SignIn
                </button>
              </>
            )}
          </div>
        </div>
      )}
     <div className={`container1 ${isAdminDash ? "d-none" : ""}`}>

        <div className="logodiv">
          <img className="logo1 my-1 " src="/Logo.jpg" alt="error" />
        </div>
        <div className="heading">
          <div>
            <h1>Ankur Vidyarthi Foundation</h1>
            <b>
              <span>Velu, Tal- Koregaon, District-Satara,415511</span>
              <span> Reg.No:- ABC123XYZ456</span>
            </b>
          </div>
        </div>
        <div className="logodiv">
          <img className="logo1 my-1 " src="/Logo.jpg" alt="error" />
        </div>
      </div>
      <div className={`navbar2 ${isAdminDash ? "d-none" : ""}`}>
        <div className="my-2">
          <ul>
            <li>
              <Link className="text-decoration-none text-white mx-2  " to="/">
                Home
              </Link>
            </li>
            <li>
              <Link
                className="text-decoration-none text-white mx-2 "
                to="/about"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                className="text-decoration-none text-white mx-2 "
                to="/contact"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                className="text-decoration-none text-white mx-2 "
                to="/donate"
              >
                Donate Us
              </Link>
            </li>
            <li>
              <Link
                className="text-decoration-none text-white mx-2 "
                to="/Market"
              >
                Market
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {showSignInModal && (
        <div className="modal">
          <div className="modal-content d-flex ">
            <SignInModal
              toggleSignInModal={toggleSignInModal}
              setAuthenticated={setAuthenticated}
              setUserName={setUserName}
            />
            <div className="close mx-3 my-1  " onClick={toggleSignInModal}>
              &times;
            </div>
          </div>
        </div>
      )}
      {showSignUpModal && (
        <div className="modal">
          <div className="modal-content d-flex ">
            <SignUpModal toggleSignUpModal={toggleSignUpModal}></SignUpModal>
            <div className="close mx-3 my-1  " onClick={toggleSignUpModal}>
              &times;
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
