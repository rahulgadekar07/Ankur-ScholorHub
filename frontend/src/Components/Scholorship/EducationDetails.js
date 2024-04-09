import React, { useState } from "react";

const EducationDetails = () => {
  const [qualification, setQualification] = useState("");
  const [courseName, setCourseName] = useState("");
  const [institute, setInstitute] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [idCard, setIdCard] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here, you can send data to backend or do further processing
    console.log({
      qualification,
      courseName,
      institute,
      currentYear,
      idCard,
    });
    // Clear form fields after submission (No need for this in case of reset button)
  };

  return (
    <div className="container">
      <h2>Education Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="qualification">Qualification</label>
          <input
            type="text"
            className="form-control"
            id="qualification"
            name="qualification"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="courseName">Course/Degree Name</label>
          <select
            className="form-control"
            id="courseName"
            name="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Graduation">Graduation</option>
            <option value="Post Graduation">Post Graduation</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="institute">Name of College/University</label>
          <input
            type="text"
            className="form-control"
            id="institute"
            name="institute"
            value={institute}
            onChange={(e) => setInstitute(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="currentYear">Current Studying Year</label>
          <input
            type="number"
            className="form-control"
            id="currentYear"
            name="currentYear"
            value={currentYear}
            onChange={(e) => setCurrentYear(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="idCard">ID Card of the Institute</label>
          <input
            type="text"
            className="form-control"
            id="idCard"
            name="idCard"
            value={idCard}
            onChange={(e) => setIdCard(e.target.value)}
            required
          />
        </div>
        <div className="buttons my-3 d-flex flex-column">
          <button type="submit" className="btn btn-success my-2">
            Save
          </button>
          <input type="reset" className="btn btn-danger my-2" value="Clear" />
        </div>
      </form>
    </div>
  );
};

export default EducationDetails;
