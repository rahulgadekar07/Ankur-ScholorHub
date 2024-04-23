import React, { useState, useEffect } from "react";
import "../../Styles/DisplayQuiz.css";

const DisplayQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);

  const [showPreviousButton, setShowPreviousButton] = useState(false); // State to toggle visibility of the previous button
  const [submitted, setSubmitted] = useState(false); // State to track whether the quiz has been submitted
  const [timeLeft, setTimeLeft] = useState(1800); // Timer set to 30 minutes (1800 seconds)
  const [isLessThan20, setIsLessThan20] = useState(false);
  // Timer functionality
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/quiz/getallquestions"
        ); // Replace this URL with your backend endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          setSubmitted(true); // Automatically submit quiz when time is up
          return prevTime;
        }
        if (prevTime <= 20) {
          setIsLessThan20(true); // Set state to indicate timer is less than 20 seconds
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to handle user selection of an option
  const handleOptionSelect = (option) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].selectedOption = option;
    updatedQuestions[currentQuestionIndex].answered = true;
    setQuestions(updatedQuestions);
    setShowPreviousButton(true);

    
  };

  // Function to handle submission of the current question
  const handleSubmit = () => {
    // Check if all questions are answered

    const isAllAnswered = questions.every((question) => question.answered);
    if (!isAllAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }
    // For demo purposes, we'll just move to the next question
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setShowPreviousButton(false);

    // Check if it's the last question
    if (currentQuestionIndex === questions.length - 1) {
      // Handle submission and display result
      setSubmitted(true);
      setTimeLeft(0);
    }
  };

  // Function to handle navigation to the previous question
  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    if (currentQuestionIndex === 1) {
      setShowPreviousButton(false);
    }
  };
  // Calculate the number of correct answers
  console.log("question.selectedOption:- ", questions);
  // Calculate the number of correct answers
  const correctAnswersCount = questions.filter(
    (question) => question.selectedOption === question.right_option
  ).length;
  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setShowPreviousButton(true); // Show previous button after moving to the next question
  };
  // Render the current question and options
  // Render the current question and options
  // Render the current question and options
  // Render the current question and options
  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      return <p>No more questions available</p>; // Display a message when all questions are answered
    }
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
      <div>
        
{        console.log("currentQuestion.id:- ",currentQuestion.question_id)
}        <h4 className="exo-2">{currentQuestion.question_id}]  {currentQuestion.question}</h4>
        <ul>
          {Object.keys(currentQuestion)
            .filter((key) => key.startsWith("option"))
            .map((key, index) => (
              <li key={index}>
                <input
                  type="radio"
                  id={`option${index}`}
                  name="options"
                  value={currentQuestion[key]}
                  checked={
                    currentQuestion.selectedOption === currentQuestion[key]
                  }
                  onChange={() => handleOptionSelect(currentQuestion[key])}
                />
                <label htmlFor={`option${index}`}>{currentQuestion[key]}</label>
              </li>
            ))}
        </ul>
        <hr />
        <div className="btn-container">
          {!isFirstQuestion && (
            <button className="btn btn-primary" onClick={handlePrevious}>
              Previous
            </button>
          )}
          {!isLastQuestion ? (
            <button className="btn btn-success" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render the list of questions for navigation
  const renderQuestionList = () => {
    return (
      <div className="question-list-container">
        {questions.map((question, index) => (
          <div
            key={index}
            className={`question-item ${question.answered ? "answered" : ""} ${
              index === currentQuestionIndex ? "current" : ""
            }`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>
    );
  };

  // Render quiz result if submitted
  const renderResult = () => {
    return (
      <div>
        <p>Quiz submitted!</p>
        <p>
          Correct Answers: {correctAnswersCount} / {questions.length}
        </p>
      </div>
    );
  };

  // Render quiz instructions
  const renderInstructions = () => {
    return (
      <div className="d-flex flex-column text-center ">
        <h2>Quiz Instructions:- </h2>
        <div>
          <em>
            1. Answer all questions before submitting. <br /> 2. Once submitted,
            you cannot change your answers. <br /> 3. Time for the Test is 30
            minutes. <br /> 4. After Timer Runs of Test will get Submitted.
          </em>
          <br/>
          <button
            className="btn btn-primary mt-2 "
            onClick={() => setQuizStarted(true)}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="quiz-container" style={{ marginBottom: "50px" }}>
      <h1>Aptitude Test</h1>
      <hr />
      {!quizStarted ? (
        renderInstructions()
      ) : (
        <div className="d-flex justify-content-xl-between   ">
          <div className={`timer ${isLessThan20 ? "less-than-20" : ""}`}>
            Time Left: {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
          </div>
          <div className="question-list-container">{renderQuestionList()}</div>
        </div>
      )}
      <hr />

      {quizStarted && (
        <div className="question-container">
          {submitted ? renderResult() : renderQuestion()}
        </div>
      )}
    </div>
  );
};

export default DisplayQuiz;