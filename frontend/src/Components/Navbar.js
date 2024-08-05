import React, { useState,useEffect } from 'react';
import '../Styles/Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SignInModal from './Modals/SignInModal';
import SignUpModal from './Modals/SignUpModal';
import { useAuth } from '../Contexts/authContext';
import { decodeToken } from '../Utils/auth';
import PopupAlert from '../Components/Alerts/PopupAlert';
import ConfirmBox from '../Components/Alerts/ConfirmBox';

function Navbar() {
  const apiUrl=process.env.REACT_APP_URL;

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    type: 'warning',
    message: 'alert message',
  });
  const [userName, setUserName] = useState('');
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showConfirmBox, setShowConfirmBox] = useState(false);

  const location = useLocation(); // Get current location
  const isAdminDash =
    location.pathname === '/admindash' || location.pathname === '/adminappform';

  useEffect(() => {
    // Check if the user is already authenticated based on the token stored in local storage

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User is not authenticated');
        }
        const decodedToken = decodeToken(token);
        const userId = decodedToken.userId;
        const response = await fetch(`${apiUrl}/user/getUserData`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token},userId=${userId}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUserData(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);

        setError(error.message);
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);

      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setUserName(decodedToken.email ?? '');
        // Assuming the token contains the user's ID
      }
    }
    fetchUserData();
  }, []);

  const toggleSignInModal = () => {
    setShowSignInModal(!showSignInModal);
  };

  const toggleSignUpModal = () => {
    setShowSignUpModal(!showSignUpModal);
  };

  const handleLogoutConfirm = (confirmed) => {
    if (confirmed) {
      localStorage.removeItem('token');
      signOut();
      setAuthenticated(false);
      navigate('/');
      setUserName('');
    }
    setShowConfirmBox(false);
  };

  const handleSignOut = () => {
    setShowConfirmBox(true);
  };

  const handleDonate = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setShowAlert(true);
      setAlertSettings({
        type: 'failure',
        message: 'Sign in before Donation',
      });
    } else {
      navigate('/donate');
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const profpic = userData?.profpic;
  const replacedImgUrl = profpic?.replace(/\\/g, '/');
  const imageUrl = `../../../backend/${replacedImgUrl}`;
  const filename = imageUrl?.substring(imageUrl.lastIndexOf('/') + 1);

  return (
    <>
      {showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert}
        />
      )}
      {!isAdminDash && (
        <div className="navbar1">
          <div className="navbar1-left my-1 ">
            <i className="fa-solid fa-envelope mx-1 "></i>
            <span>ankurfoundation@gmail.com</span>
          </div>
          <div className="navbar1-right">
            {authenticated ? (
              <div className="dropdown">
                {userData && (
                  <img
                    className="rounded-5"
                    src={`http://localhost:5000/profile_images/${filename}`}
                    alt="Profile Picture"
                    style={{ height: '40px', width: '40px' }}
                  />
                )}
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
                  <li className="my-1">
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li className="my-1">
                    <Link className="dropdown-item" to="/additem">
                      Upload Sales Items
                    </Link>
                  </li>
                  <li className="my-1">
                    <Link className="dropdown-item" to="/myproducts">
                      My Products
                    </Link>
                  </li>
                  <li className="my-1">
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
      <div className={`container1 ${isAdminDash ? 'd-none' : ''}`}>
        <div className="logodiv">
          <img className="logo1 my-1 " src="/Logo.jpg" alt="error" />
        </div>
        <div className="heading ">
          <div className="d-flex flex-column align-items-center ">
            <h1 className="">अंकुर विद्यार्थी फाउंडेशन</h1>

            <span>
              {' '}
              <b>र. वि. नं. महा /३५६/२०२०/</b>E-Mail:
              ankur.vidyarthi.foundation@gmail.com
            </span>

            <span className="mb-2">
              <b>पत्ता:-</b> मु .पो. वेळू , ग्रामपंचायत कायाालय, दुसरा मजला ,
              ता. कोरेगाव,जि. सातारा, ४१५५११
            </span>
          </div>
        </div>

        <div className="logodiv">
          <img className="logo1 my-1 " src="/Logo.jpg" alt="error" />
        </div>
      </div>
      <div className={`navbar2 ${isAdminDash ? 'd-none' : ''}`}>
        <div className="my-2">
          <ul>
            <li className="my-1">
              <Link className="text-decoration-none text-white mx-2  " to="/">
                Home
              </Link>
            </li>
            <li className="my-1">
              <Link
                className="text-decoration-none text-white mx-2 "
                to="/about"
              >
                About Us
              </Link>
            </li>
            <li className="my-1">
              <Link
                className="text-decoration-none text-white mx-2 "
                to="/contact"
              >
                Contact Us
              </Link>
            </li>
            <button
              className=" btn btn-link m-0 p-0 text-decoration-none text-white mx-2 "
              onClick={handleDonate}
            >
              Donate Us
            </button>
            <li className="my-1">
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
      {showConfirmBox && (
        <ConfirmBox
          message="Are you sure you want to logout?"
          onConfirm={handleLogoutConfirm}
        />
      )}
    </>
  );
}

export default Navbar;
