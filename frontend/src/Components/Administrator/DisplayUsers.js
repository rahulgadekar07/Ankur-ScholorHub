import React from 'react';

const DisplayUsers = () => {
  return (
    <div>
      <h1>All Users</h1>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th> {/* New column for action buttons */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>john@example.com</td>
            <td>
              <button className="btn btn-danger">Remove</button> {/* Button to remove user */}
            </td>
          </tr>
          {/* Add more static table rows for additional users */}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayUsers;
