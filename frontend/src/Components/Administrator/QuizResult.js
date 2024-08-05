import React, { useState, useEffect, useContext } from 'react';
import { NewsStripContext } from '../../Contexts/NewsStripContext';

const QuizResult = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPassed, setTotalPassed] = useState(0);
  const [totalFailed, setTotalFailed] = useState(0);
  const { isNewsStripVisible, toggleNewsStrip } = useContext(NewsStripContext);
  const apiUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const response = await fetch(`${apiUrl}/quiz/getQuizResults`);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz results");
        }
        const data = await response.json();
        setQuizResults(data);

        setTotalUsers(data.length);
        const passedCount = data.filter(result => result.result === 'Pass').length;
        const failedCount = data.filter(result => result.result === 'Fail').length;
        setTotalPassed(passedCount);
        setTotalFailed(failedCount);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      }
    };

    fetchQuizResults();
  }, [apiUrl]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours() % 12 || 12;
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const formattedTime = `${('0' + hours).slice(-2)}:${('0' + date.getMinutes()).slice(-2)} ${ampm}`;
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Quiz Results</h1>
      <div className="row mb-4">
        <div className="col-md-4">
          <p>Total Users: {totalUsers}</p>
        </div>
        <div className="col-md-4">
          <p>Total Passed: {totalPassed}</p>
        </div>
        <div className="col-md-4">
          <p>Total Failed: {totalFailed}</p>
        </div>
      </div>
      <button onClick={toggleNewsStrip} className="btn btn-danger mb-4">
        {isNewsStripVisible ? "Hide Result" : "Publish Result"}
      </button>
      <table className="table">
        <thead>
          <tr>
            <th className="border">User ID</th>
            <th className="border">Score</th>
            <th className="border">Result</th>
            <th className="border">Timestamp</th>
            <th className="border">Email</th>
          </tr>
        </thead>
        <tbody>
          {quizResults.map((result, index) => (
            <tr key={index}>
              <td className="border">{result.userId}</td>
              <td className="border">{result.score}</td>
              <td className="border">{result.result}</td>
              <td className="border">{formatTimestamp(result.timestamp)}</td>
              <td className="border">{result.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizResult;
