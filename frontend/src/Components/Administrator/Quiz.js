import React, { useState, useEffect } from 'react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({
    question_id: '',
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    right_option: '' // Adding right_option field
  });
  const [forceUpdate, setForceUpdate] = useState(false); // For force re-rendering
  const apiUrl=process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${apiUrl}/quiz/getallquestions`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [forceUpdate]); // Trigger useEffect on forceUpdate change

  const handleEditClick = (question) => {
    setSelectedQuestion(question);
    setEditedQuestion(question);
    setModalVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestion(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedQuestion(null);
    setEditedQuestion({
      question_id: '',
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      right_option: ''
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${apiUrl}/quiz/updatequestion`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedQuestion)
      });
      if (response.ok) {
        const updatedQuestion = await response.json();
        console.log('Question updated successfully:', updatedQuestion);
        // Update the questions state with the updated question
        const updatedQuestions = questions.map(q => q.question_id === updatedQuestion.question_id ? updatedQuestion : q);
        setQuestions(updatedQuestions); // Update state here
        // Close the modal
        handleModalClose();
        setForceUpdate(prev => !prev); // Toggle forceUpdate to trigger re-render
      } else {
        console.error('Failed to update question');
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <div style={{height:'70vh'}}>
      <h1 className='text-center my-2'>Quiz Questions</h1>
      <table className="table table-striped  my-4" key={forceUpdate}> {/* Add key prop for force re-rendering */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Question</th>
            <th>Option 1</th>
            <th>Option 2</th>
            <th>Option 3</th>
            <th>Option 4</th>
            <th>Right Option</th> {/* Adding Right Option column */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(question => (
            <tr key={question.question_id}>
              <td>{question.question_id}</td>
              <td>{question.question}</td>
              <td>{question.option1}</td>
              <td>{question.option2}</td>
              <td>{question.option3}</td>
              <td>{question.option4}</td>
              <td>{question.right_option}</td> {/* Displaying right_option */}
              <td>
                <button className="btn btn-primary" onClick={() => handleEditClick(question)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalVisible && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Question</h5>
                <button type="button" className="close" onClick={handleModalClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="question">Question:</label>
                  <input type="text" className="form-control" id="question" name="question" value={editedQuestion.question} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="option1">Option 1:</label>
                  <input type="text" className="form-control" id="option1" name="option1" value={editedQuestion.option1} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="option2">Option 2:</label>
                  <input type="text" className="form-control" id="option2" name="option2" value={editedQuestion.option2} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="option3">Option 3:</label>
                  <input type="text" className="form-control" id="option3" name="option3" value={editedQuestion.option3} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="option4">Option 4:</label>
                  <input type="text" className="form-control" id="option4" name="option4" value={editedQuestion.option4} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="right_option">Right Option:</label>
                  <input type="text" className="form-control" id="right_option" name="right_option" value={editedQuestion.right_option} onChange={handleInputChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
