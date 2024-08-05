import React, { useState } from 'react';

const SendEmail = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const apiUrl=process.env.REACT_APP_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${apiUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, body }),
      });

      if (response.ok) {
        setResponseMessage('Email sent successfully!');
      } else {
        const errorMessage = await response.text();
        setResponseMessage(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setResponseMessage('Failed to send email. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Send Email</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>To:</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Email</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default SendEmail;
