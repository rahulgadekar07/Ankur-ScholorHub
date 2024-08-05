import React, { useState, useEffect } from 'react';
import '../../Styles/DisplayFeedback.css'; // Import the CSS file for styling
import Spinner from '../Alerts/Spinner';
import PopupAlert from "../Alerts/PopupAlert";

const DisplayFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyId, setReplyId] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const apiUrl = process.env.REACT_APP_URL;
  const [showAlert, setShowAlert] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    type: "warning",
    message: "alert message",
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/getAllFeedbacks`);
      const data = await response.json();
      
      console.log('API response:', data);

      if (Array.isArray(data.feedbacks)) {
        setFeedbacks(data.feedbacks);
      } else {
        console.error('Invalid data format:', data);
        setFeedbacks([]);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setFeedbacks([]);
    }
  };

  const handleReply = async (feedbackId) => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/admin/replyToFeedback/${feedbackId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: replyMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reply');
      }

      setReplyMessage('');
      setReplyId(null);
      setShowAlert(true);
      setAlertSettings({
        type: "success",
        message: "Reply sent successfully.",
      });
      fetchData();
    } catch (error) {
      console.error('Error sending reply:', error);
      setShowAlert(true);
      setAlertSettings({
        type: "danger",
        message: "Error sending reply",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="container">
        {showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert}
        />
      )}
      <h1 className="mt-5 mb-4">All Feedbacks</h1>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.name}</td>
                <td>{feedback.email}</td>
                <td>{feedback.subject}</td>
                <td>{feedback.message}</td>
                <td>{formatDate(feedback.created_at)}</td>
                <td>
                  {replyId === feedback.id ? (
                    <div className="reply-container">
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Write your reply here..."
                        className="reply-textarea"
                      />
                      <button
                        onClick={() => handleReply(feedback.id)}
                        className="reply-button"
                        disabled={loading}
                      >
                        {loading ? <Spinner /> : 'Send Reply'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyId(feedback.id)}
                      className="reply-button"
                    >
                      Reply
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No feedbacks available</td>
            </tr>
          )}
        </tbody>
      </table>
      
    </div>
  );
};

export default DisplayFeedback;
