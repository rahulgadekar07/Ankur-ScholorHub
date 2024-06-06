import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Spinner from '../Alerts/Spinner';

const ManageScholarship = () => {
  const [applications, setApplications] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/getAllApplications');
      if (!response.ok) {
        throw new Error('Failed to fetch scholarship applications');
      }
      const data = await response.json();
      setApplications(data.map(application => ({
        ...application,
        created_at: formatTimestamp(application.created_at)
      })));
    } catch (error) {
      console.error('Error fetching scholarship applications:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + (date.getHours() % 12 || 12)).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const isVerifyDisabled = (status) => {
    return status !== 'pending';
  };

  const openApplicationFormInNewTab = (userId) => {
    const url = `http://localhost:3000/adminappform?userId=${userId}`;
    window.open(url, '_blank');
  };

  const handleApprove = async (applicationId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/admin/approveApplication/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved', replyMessage: 'Scholarship Application Approved' }),
      });
      if (!response.ok) {
        setLoading(false);
        throw new Error('Failed to approve application');
      }
      setLoading(false);

      alert('Application approved successfully...! Notification Email Sent to User..');
      fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      setLoading(false);
    }
  };

  const handleReject = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setReplyMessage('');
    setModalIsOpen(true);
  };

  const submitReject = async () => {
    if (replyMessage.trim() === '') {
      alert('Please enter a reason for rejection.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/admin/rejectApplication/${selectedApplicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected', replyMessage }),
      });
      if (!response.ok) {
        setLoading(false);
        throw new Error('Failed to reject application');
      }
      fetchApplications();
      setLoading(false);
      alert('Application Rejected Successfully..! Notification Email Sent to User..');

      setModalIsOpen(false);
    } catch (error) {
      console.error('Error rejecting application:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Manage Scholarship Applications</h1>
      <table className="table table-striped table-bordered">
        <thead className="text-center justify-content-center">
          <tr>
            <th>Application ID</th>
            <th>User ID</th>
            <th>Status</th>
            <th>Submitted At</th>
            <th>Reply Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {applications.map((application) => (
            <tr key={application.id}>
              <td>{application.id}</td>
              <td>{application.userId}</td>
              <td>{application.status}</td>
              <td>{application.created_at}</td>
              <td>{application.replyMessage}</td>
              <td className="d-flex flex-column">
                <button
                  className="btn btn-info btn-sm my-1"
                  disabled={isVerifyDisabled(application.status)}
                  onClick={() => openApplicationFormInNewTab(application.userId)}
                >
                  Verify
                </button>
                <button
                  className="btn btn-success btn-sm my-1"
                  onClick={() => handleApprove(application.id)}
                  disabled={application.status !== 'pending'}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger btn-sm my-1"
                  onClick={() => handleReject(application.id)}
                  disabled={application.status !== 'pending'}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false} // Prevents the app from being hidden from screen readers
      >
        <div>
          <h2>Reject Application</h2>
          <label htmlFor="replyMessage">Mention Reason:</label>
          <textarea
            id="replyMessage"
            className="form-control"
            rows="3"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            required
          />
          <button className="btn btn-secondary my-2 mx-2" onClick={() => setModalIsOpen(false)}>Close</button>
          <button className="btn btn-danger my-2 mx-2" onClick={submitReject}>Reject</button>
        </div>
      </Modal>
      {loading && <Spinner />}
    </div>
  );
};

export default ManageScholarship;
