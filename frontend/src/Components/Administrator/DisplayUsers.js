import React, { useState, useEffect } from "react";
import Spinner from "../Alerts/Spinner";

const DisplayUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch users data from backend when component mounts
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/getusers");
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
  }, []);

  // Function to handle user removal
  const handleRemoveUser = async (userId, userEmail) => {
    let conf = window.confirm("Are You Sure?");
    if (conf) {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/admin/removeuser/${userId}?email=${encodeURIComponent(
            userEmail
          )}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to remove user");
        }
        // If user is removed successfully, update the users state
        setUsers(users.filter((user) => user.id !== userId));
        alert(
          "User Removed Successfully...! and Notification Email sent to User"
        );
      } catch (error) {
        console.error("Error removing user:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div style={{ height: "50vh" }}>
      <h1 className="text-center my-2">All Users</h1>
      {users.length === 0 ? (
        <p className="text-center">No users found</p>
      ) : (
        <table className="table table-striped table-bordered ">
          <thead className="text-center ">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveUser(user.id, user.email)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {loading && <Spinner />}
        </table>
      )}
    </div>
  );
};

export default DisplayUsers;
