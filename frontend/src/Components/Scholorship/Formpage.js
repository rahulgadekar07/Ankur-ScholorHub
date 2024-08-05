import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/authContext";
import "../../Styles/Formpage.css";
import PersonalDetails from "./PersonalDetails";
import AddressDetails from "./AddressDetails";
import EducationDetails from "./EducationDetails";
import IncomeDetails from "./IncomeDetails";

const Formpage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
 
  const [bgcolor1,setbgcolor1]=useState(false)
  const [bgcolor2,setbgcolor2]=useState(false)
  const [bgcolor3,setbgcolor3]=useState(false)
  const [bgcolor4,setbgcolor4]=useState(false)

 
  const [activeSection, setActiveSection] = useState("personal-details"); // State to track active section

  const handleSectionClick = (section) => { 
    setActiveSection(section);
    // Update active section
  };

  // Render the corresponding component based on activeSection
   
  
  return (
    <div className="flex text-center ">
       

      <h1 className="my-4 ">Application Form</h1>

      <div className="scholorMenu p-4 ">
      <hr />
        <div className={`head my-2  d-flex flex-row p-2 justify-content-evenly    `}>
          <div
             className={`section1 d-flex flex-column justify-content-evenly ${bgcolor1 ? 'section1saved' : ''}`}
            onClick={() => handleSectionClick("personal-details")}
          >
            <i className="fa-solid fa-user  fsize "></i>
            <span>Personal Details</span>
          </div>
          <div
            className={`section1 d-flex flex-column justify-content-evenly ${bgcolor2 ? 'section1saved' : ''}`}
            onClick={() => handleSectionClick("address-details")}
          >
            <i className="fa-solid fa-address-book fsize "></i>
            <span>Address Details</span>
          </div>
          <div
            className={`section1 d-flex flex-column justify-content-evenly ${bgcolor3 ? 'section1saved' : ''}`}
            onClick={() => handleSectionClick("income-details")}
          >
            <i className="fa-solid fa-briefcase  fsize "></i>
            <span>Income</span>
            <span>Details</span>
          </div>
          <div
            className={`section1 d-flex flex-column justify-content-evenly ${bgcolor4 ? 'section1saved' : ''}`}
            onClick={() => handleSectionClick("education-details")}
          >
            <i className="fa-solid fa-book-open-reader  fsize "></i>
            <span>Educational Details</span>
          </div>
        </div>
        <hr />
        {activeSection === "personal-details" ? <PersonalDetails setActiveSection={setActiveSection} bgcolor1={bgcolor1} setbgcolor1={setbgcolor1} /> : null}
        {activeSection === "address-details" ? <AddressDetails setActiveSection={setActiveSection} bgcolor2={bgcolor2} setbgcolor2={setbgcolor2} /> : null}
        {activeSection === "income-details" ? <IncomeDetails setActiveSection={setActiveSection} bgcolor3={bgcolor3} setbgcolor3={setbgcolor3}/> : null}
        {activeSection === "education-details" ? <EducationDetails setActiveSection={setActiveSection} bgcolor4={bgcolor4} setbgcolor4={setbgcolor4}/> : null}
      </div>
      
    </div>
  );
};

export default Formpage;
