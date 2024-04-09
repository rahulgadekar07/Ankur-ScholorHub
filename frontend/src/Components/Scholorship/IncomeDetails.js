import React from "react";

const IncomeDetails = () => {
  // Sample job options
  const jobOptions = [
    { value: "", label: "Select Occupation" },
    { value: "job", label: "Job" },
    { value: "business", label: "Business" },
    { value: "others", label: "Others" },
  ];

  return (
    <>
      <h2>Income Details:</h2>
      <hr />
      <form className="income-details-form d-flex flex-column ">
        {/* Parent Information */}
        <div className="form-group">
          <label htmlFor="parentName">Parent Name</label>
          <input type="text" className="form-control" id="parentName" placeholder="Enter Parent Name" required />
        </div>
        <div className="form-group">
          <label htmlFor="parentMobile">Parent Mobile</label>
          <input type="tel" className="form-control" id="parentMobile" placeholder="Enter Parent Mobile" required />
        </div>

        {/* Job Information */}
        <div className="form-group">
          <label htmlFor="jobType">Occupation</label>
          <select className="form-select" id="jobType" required>
            {jobOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Job Description */}
        <div className="form-group">
          <label htmlFor="jobDescription">Job Description</label>
          <input type="text" className="form-control" id="jobDescription" placeholder="Enter Job Description" />
        </div>

        {/* Income Information */}
        <label htmlFor="annualIncome" className="my-1 ">(₹) Annual Income </label>
        <div className="form-group d-flex my-2">
          <div className="input-group ms-2"> {/* Add margin-left for spacing */}
            <span className="input-group-text">₹</span>
            <input
              type="number" // Ensure numerical input for income
              className="form-control"
              aria-label="Annual Income (in rupees)"
              placeholder="Enter Annual Income"
            />
            <span className="input-group-text">.00</span>
          </div>
        </div>

        {/* Income Certificate */}
        <div className="form-group">
          <label htmlFor="incomeCertificate">Income Certificate</label>
          <input type="file" className="form-control" id="incomeCertificate" />
        </div>

        {/* Form Buttons */}
        <div className="buttons my-3 d-flex flex-column">
          <button type="submit" className="btn btn-success my-2">
            Save
          </button>
          <button type="reset" className="btn btn-danger my-1">
            Clear
          </button>
        </div>
      </form>
    </>
  );
};

export default IncomeDetails;
