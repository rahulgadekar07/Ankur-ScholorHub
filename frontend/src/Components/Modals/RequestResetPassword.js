import React, { useState } from "react";
import Spinner from "../Alerts/Spinner"; // Import the Spinner component
import { useNavigate } from "react-router-dom";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/user/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setMessage("Verification code sent to your email.");
      } else {
        setMessage(result.error || "Failed to send verification code.");
      }
    } catch (error) {
      setMessage("Failed to send verification code. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleVerifyCode = () => {
    navigate("/verify-reset-password");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Request Password Reset</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
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
              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Send Code"}
              </button>
              {message && (
                <>
                  <p className="text-center" style={{ color: message.includes("User not found") ? 'red' : 'green' }}>
                    <b>{message}</b>
                  </p>
                  {!message.includes("User not found") && (
                    <button
                      className="btn btn-primary w-100 mb-3"
                      onClick={handleVerifyCode}
                    >
                      {" "}
                      Verify Code{" "}
                    </button>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestResetPassword;
