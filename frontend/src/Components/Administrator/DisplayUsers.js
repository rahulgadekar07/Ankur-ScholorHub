import React, { useState, useEffect } from "react";
import Spinner from "../Alerts/Spinner";
import ConfirmBox from '../Alerts/ConfirmBox';
import PopupAlert from '../Alerts/PopupAlert';

const DisplayUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // state to store the selected user
  const apiUrl = process.env.REACT_APP_URL;
  const [showAlert, setShowAlert] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    type: 'warning',
    message: 'alert message',
  });
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/admin/getusers`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const userData = await response.json();
        console.log("users:- ", userData);
        setUsers(userData.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [apiUrl]);

  const handleBlockConfirm = async (confirmed) => {
    if (confirmed && selectedUser) {
      const { userId, userEmail, isBlocked } = selectedUser;
      
      
        setLoading(true);
        try {
          const response = await fetch(
            `${apiUrl}/admin/blockuser/${userId}?email=${encodeURIComponent(
              userEmail
            )}&block=${!isBlocked}`,
            {
              method: "PATCH", // Use PATCH or PUT for updating resources
            }
          );
          if (!response.ok) {
            throw new Error(`Failed to ${isBlocked ? 'unblock' : 'block'} user`);
          }
          setUsers(users.map((user) => user.id === userId ? { ...user, blocked: !isBlocked } : user));
          setShowAlert(true);
          setAlertSettings({
            type: 'success',
            message: `User ${isBlocked ? 'unblocked' : 'blocked'} Successfully...! and Notification sent to User`,
          });
         
        } catch (error) {
          console.error(`Error ${isBlocked ? 'unblocking' : 'blocking'} user:`, error);
        } finally {
          setLoading(false);
        }
      
    }
    setShowConfirmBox(false);
  };

  const handleBlockUser = (userId, userEmail, isBlocked) => {
    setSelectedUser({ userId, userEmail, isBlocked });
    setShowConfirmBox(true);
  };

  
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  return (
    <div style={{ height: "50vh" }}>
       {showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert}
        />
      )}
      {showConfirmBox && selectedUser && (
        <ConfirmBox
          message={`Are you sure you want to ${selectedUser.isBlocked ? 'unblock' : 'block'} this user?`}
          onConfirm={handleBlockConfirm}
        />
      )}
      <h1 className="text-center my-2">All Users</h1>
      {loading && <Spinner />}
      {users.length === 0 ? (
        <p className="text-center">No users found</p>
      ) : (
        <table className="table table-striped table-bordered ">
          <thead className="text-center ">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Blocked</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.blocked ? "Yes" : "No"}</td>
                <td>
                  <button
                    className={`btn ${user.blocked ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => handleBlockUser(user.id, user.email, user.blocked)}
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DisplayUsers;
