import React, { useState, useEffect } from "react";
import { decodeToken } from "../../Utils/auth";
import Spinner from "../Alerts/Spinner";
import "../../Styles/DisplayQuizResults.css";


const DisplayQuizResults = () => {
  const apiUrl = process.env.REACT_APP_URL;
  const token = localStorage.getItem("token");
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    

    const fetchQuizResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = decodeToken(token);
        const userId = decodedToken.userId;

        const response = await fetch(`${apiUrl}/quiz/getUserQuizResults/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quiz results");
        }

        const data = await response.json();
        console.log("FETCHED QUIZ RESULT: ",data.results)
        setQuizResults(data.results[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [apiUrl]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    return {
      date: date.toLocaleDateString('en-GB', options),
      time: date.toLocaleTimeString('en-US', timeOptions),
    };
  };

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div className="container5 border border-warning rounded mt-3 mb-5 text-center animate__animated animate__fadeInUp " >
     
      {/* <h1 className="my-3">Quiz Results</h1>
      <hr /> */}
      {quizResults ? (
        <div className="quiz-results">
          <h2 className="my-2">Your Quiz Results</h2>
          <div className="result-card animate__animated animate__fadeIn">
            {quizResults.score !== undefined && (
              <div className="result-item">
                <strong>Score:</strong> {quizResults.score}
              </div>
            )}
            {quizResults.result && (
              <div className={`result-item ${quizResults.result.toLowerCase()}`}>
                <strong>Result:</strong> {quizResults.result}
              </div>
            )}
            {quizResults.timestamp && (
              <div className="result-item">
                <strong>Date:</strong> {formatDate(quizResults.timestamp).date}
              </div>
            )}
            {quizResults.timestamp && (
              <div className="result-item">
                <strong>Time:</strong> {formatDate(quizResults.timestamp).time}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>No quiz results available.</p>
      )}
    </div>
  );
};

export default DisplayQuizResults;
