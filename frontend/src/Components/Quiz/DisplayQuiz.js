import React, { useState, useEffect } from "react";
import "../../Styles/DisplayQuiz.css";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../../Utils/auth";
import ConfirmBox from "../Alerts/ConfirmBox";
import PopupAlert from '../Alerts/PopupAlert';

const DisplayQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [showSubmitConfirmBox, setShowSubmitConfirmBox] = useState(false);
  const [showPreviousButton, setShowPreviousButton] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1000);
  const [isLessThan20, setIsLessThan20] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_URL;
  const [showAlert, setShowAlert] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    type: 'warning',
    message: 'alert message',
  });
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken.userId;
  const email = decodedToken.email;
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  useEffect(() => {
    const checkUserQuizStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/quiz/checkUserQuizStatus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        });

        if (response.ok) {
          const { hasSubmittedQuiz } = await response.json();
          if (hasSubmittedQuiz) {
           
            setShowAlert(true);
            setAlertSettings({
              type: 'failure',
              message: 'You have already submitted the quiz. ',
            });
            navigate("/");
          }
        } else {
          console.error("Failed to check user quiz status");
        }
      } catch (error) {
        console.error("Error checking user quiz status:", error);
      }
    };

    checkUserQuizStatus();

    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${apiUrl}/quiz/getallquestions`);
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
          setSubmitted(true);
          return prevTime;
        }
        if (prevTime <= 20) {
          setIsLessThan20(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = (option) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].selectedOption = option;
    updatedQuestions[currentQuestionIndex].answered = true;
    setQuestions(updatedQuestions);
    setShowPreviousButton(true);
  };

  const handleSubmit = async () => {
    const isAllAnswered = questions.every((question) => question.answered);
    if (!isAllAnswered) {
      setShowAlert(true);
      setAlertSettings({
        type: 'warning',
        message: 'Please answer all questions before submitting.',
      });
      return;
    }

    const correctAnswersCount = questions.filter(
      (question) => question.selectedOption === question.right_option
    ).length;
    setCorrectAnswersCount(correctAnswersCount);

    const passingCriteria = Math.ceil(questions.length * 0.4);
    const result = correctAnswersCount >= passingCriteria ? "Pass" : "Fail";

    try {
      const response = await fetch(`${apiUrl}/quiz/saveQuizResult`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          score: correctAnswersCount,
          result: result,
          email: email,
        }),
      });

      if (response.ok) {
        setShowAlert(true);
        setAlertSettings({
          type: 'success',
          message: 'Quiz result saved successfully.',
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
       
      } else {
        console.error("Failed to save quiz result");
      }
    } catch (error) {
      console.error("Error saving quiz result:", error);
    }

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setShowPreviousButton(false);

    if (currentQuestionIndex === questions.length - 1) {
      setSubmitted(true);
      setTimeLeft(0);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    if (currentQuestionIndex === 1) {
      setShowPreviousButton(false);
    }
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setShowPreviousButton(true);
  };

  const handleSubmitConfirm = (confirmed) => {
    if (confirmed) {
      handleSubmit();
    }
    setShowSubmitConfirmBox(false);
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      return <p>No more questions available</p>;
    }
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
      <div>
        <h4 className="exo-2">
          {currentQuestion.question_id}] {currentQuestion.question}
        </h4>
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
            <button className="btn btn-success" onClick={() => setShowSubmitConfirmBox(true)}>
              Submit
            </button>
          )}
        </div>
      </div>
    );
  };

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
          <br />
          <button
            className="btn btn-primary mt-2 "
            onClick={() => setShowConfirmBox(true)}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  };

  const handleStartQuizConfirm = (confirmed) => {
    if (confirmed) {
      setQuizStarted(true);
    }
    setShowConfirmBox(false);
  };

  return (
    <div className="quiz-container" style={{ marginBottom: "50px" }}>
      {showConfirmBox && (
        <ConfirmBox
          message="Are you sure you want to start the quiz?"
          onConfirm={handleStartQuizConfirm}
        />
      )}
       {showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert}
        />
      )}
      {showSubmitConfirmBox && (
        <ConfirmBox
          message="Are you sure you want to submit the quiz?"
          onConfirm={handleSubmitConfirm}
        />
      )}
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
