import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import PopupAlert from '../Alerts/PopupAlert';

const VerifyAndResetPassword = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState("");
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const [alertSettings, setAlertSettings] = useState({
    type: 'warning',
    message: 'alert message',
  });

  const newPasswordRef = useRef(null); // Create a ref for the new password input field

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setPasswordMismatch("Passwords do not match.");
    } else {
      setPasswordMismatch("");
    }
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (successMessage === "Verification code is valid. You can now reset your password.") {
      // Focus on the new password input field
      newPasswordRef.current?.focus();
    }
  }, [successMessage]);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/user/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Verification code is valid. You can now reset your password.");
        setPasswordMismatch(""); // Clear any previous mismatch error
      } else {
        setErrorMessage(result.error || "Verification code is invalid or expired.");
      }
    } catch (error) {
      setErrorMessage("Failed to verify code. Please try again later.");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMismatch("Passwords do not match.");
      return;
    } else {
      setPasswordMismatch(""); // Clear the mismatch error if passwords match
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword, verificationCode }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Password reset successfully.");
        setShowAlert(true);
        setAlertSettings({
          type: 'success',
          message: 'Password reset successfully. ',
        });
        setTimeout(() => {
          navigate('/'); // Redirect to sign-in page
        }, 3000);
       
      } else {
        setErrorMessage(result.error || "Failed to reset password.");
      }
    } catch (error) {
      setErrorMessage("Failed to reset password. Please try again later.");
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="container mt-5">
      {showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert}
        />
      )}
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Verify Code and Reset Password</h2>
            <form onSubmit={handleVerify}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="verificationCode" className="form-label">Verification Code:</label>
                <input
                  type="text"
                  className="form-control"
                  id="verificationCode"
                  name="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-3">Verify Code</button>
              {successMessage && <p className="text-success text-center">{successMessage}</p>}
              {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
            </form>
            {successMessage === "Verification code is valid. You can now reset your password." && (
              <form onSubmit={handleReset}>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password:</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    ref={newPasswordRef} // Assign ref to the input
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {passwordMismatch && <p className="text-danger">{passwordMismatch}</p>}
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label className="form-check-label" htmlFor="showPassword">Show Password</label>
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">Reset Password</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAndResetPassword;
