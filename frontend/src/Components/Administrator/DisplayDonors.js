import React, { useState, useEffect } from 'react';

const DisplayDonors = () => {
  const [donors, setDonors] = useState([]);
  const [totalDonation, setTotalDonation] = useState(0);
  const apiUrl=process.env.REACT_APP_URL;

  useEffect(() => {
    // Fetch data from the backend API
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch donors data from the backend API
      const response = await fetch(`${apiUrl}/admin/getAllDonors`);
      const data = await response.json();

      // Set donors data
      setDonors(data.donors[0]);

      // Calculate total donation
      let total = 0;
      data.donors[0].forEach(donor => {
        const amount = parseFloat(donor.amount);
        if (!isNaN(amount)) {
          total += amount;
        }
      });
      setTotalDonation(total);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to format date in dd/mm/yyyy format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to format time in 24-hour pattern
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="container">
      <h1 className="mt-5 mb-4">All Donors - Total Donation: ₹{totalDonation.toFixed(2)}</h1>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Amount Donated</th>
            <th>Timing</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((donor, index) => (
            <tr key={index}>
              <td>{donor.name}</td>
              <td>{donor.email}</td>
              <td>₹{parseFloat(donor.amount).toFixed(2)}</td>
              <td>{formatTime(donor.created_at)}</td>
              <td>{formatDate(donor.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayDonors;
