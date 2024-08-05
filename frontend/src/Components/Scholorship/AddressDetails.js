import React, { useState, useEffect } from "react";
import { decodeToken } from "../../Utils/auth";
import PopupAlert from "../../Components/Alerts/PopupAlert";
import ConfirmBox from '../Alerts/ConfirmBox';

const AddressDetails = (props) => {
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const apiUrl=process.env.REACT_APP_URL;

  const [currentAddress, setCurrentAddress] = useState({
    address: "",
    state: "",
    district: "",
    taluka: "",
    city: "",
    pincode: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    type: "warning",
    message: "alert message",
  });

  const checkAddressDetails = async () => {
    try {
      const userId = decodedToken.userId;

      const response = await fetch(
        `${apiUrl}/scholarship/checkAddressDetails/${userId}`
      );
      const data = await response.json();
      if (data.detailsExist2) {
        setShowAlert(true);
        setAlertSettings({
          type: "failure",
          message: "Already saved Address Details",
        });
       
      }
    } catch (error) {
      console.error("Error checking user details:", error);
    }
  };

  useEffect(() => {
    checkAddressDetails();
  }, []);

  const [permanentAddress, setPermanentAddress] = useState({
    address: "",
    state: "Maharashtra",
    district: "",
    taluka: "",
    city: "",
    pincode: "",
  });

  const maharashtraData = {
    Maharashtra: {
      districts: [
        "Ahmednagar",
        "Akola",
        "Amravati",
        "Aurangabad",
        "Beed",
        "Bhandara",
        "Buldhana",
        "Chandrapur",
        "Dhule",
        "Gadchiroli",
        "Gondia",
        "Hingoli",
        "Jalgaon",
        "Jalna",
        "Kolhapur",
        "Latur",
        "Mumbai City",
        "Mumbai Suburban",
        "Nagpur",
        "Nanded",
        "Nandurbar",
        "Nashik",
        "Osmanabad",
        "Palghar",
        "Parbhani",
        "Pune",
        "Raigad",
        "Ratnagiri",
        "Sangli",
        "Satara",
        "Sindhudurg",
        "Solapur",
        "Thane",
        "Wardha",
        "Washim",
        "Yavatmal",
      ],
      talukas: {
        Ahmednagar: ["Ahmednagar", "Shrirampur", "Rahata"],
        Akola: ["Akola", "Murtizapur", "Balapur"],
        Amravati: ["Amravati", "Chandur Bazar", "Daryapur"],
        Aurangabad: ["Aurangabad", "Gangapur", "Paithan"],
        Beed: ["Beed", "Kaij", "Ashti"],
        Bhandara: ["Bhandara", "Tumsar", "Sakoli"],
        Buldhana: ["Buldhana", "Malkapur", "Shegaon"],
        Chandrapur: ["Chandrapur", "Ballarpur", "Brahmapuri"],
        Dhule: ["Dhule", "Sakri", "Shirpur"],
        Gadchiroli: ["Gadchiroli", "Armori", "Desaiganj"],
        Gondia: ["Gondia", "Goregaon", "Tirora"],
        Hingoli: ["Hingoli", "Sengaon", "Kalamnuri"],
        Jalgaon: ["Jalgaon", "Bhusawal", "Jamner"],
        Jalna: ["Jalna", "Ambad", "Bhadli"],
        Kolhapur: ["Kolhapur", "Karvir", "Hatkanangle"],
        Latur: ["Latur", "Ahmadpur", "Udgir"],
        "Mumbai City": ["South Mumbai", "North Mumbai", "Central Mumbai"],
        "Mumbai Suburban": ["Andheri", "Borivali", "Kurla"],
        Nagpur: ["Nagpur", "Kamptee", "Umred"],
        Nanded: ["Nanded", "Bhokar", "Mudkhed"],
        Nandurbar: ["Nandurbar", "Shahada", "Taloda"],
        Nashik: ["Nashik", "Malegaon", "Sinnar"],
        Osmanabad: ["Osmanabad", "Paranda", "Tuljapur"],
        Palghar: ["Palghar", "Vasai", "Dahanu"],
        Parbhani: ["Parbhani", "Jintur", "Gangakhed"],
        Pune: ["Pune", "Haveli", "Maval"],
        Raigad: ["Alibag", "Pen", "Mahad"],
        Ratnagiri: ["Ratnagiri", "Chiplun", "Guhagar"],
        Sangli: ["Sangli", "Miraj", "Ashta"],
        Satara: ["Satara", "Karad", "Wai"],
        Sindhudurg: ["Sindhudurg", "Kudal", "Vengurla"],
        Solapur: ["Solapur", "Akkalkot", "Pandharpur"],
        Thane: ["Thane", "Kalyan", "Ulhasnagar"],
        Wardha: ["Wardha", "Hinganghat", "Arvi"],
        Washim: ["Washim", "Malegaon", "Mangrulpir"],
        Yavatmal: ["Yavatmal", "Pusad", "Umarkhed"],
      },
    },
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
    props.setActiveSection("income-details");
    props.setbgcolor2(true)

  };
  const handleCheckboxChange = () => {
    setSameAsPermanent(!sameAsPermanent);
    if (!sameAsPermanent) {
      setCurrentAddress({ ...permanentAddress });
    } else {
      setCurrentAddress({
        address: "",
        state: "",
        district: "",
        taluka: "",
        city: "",
        pincode: "",
      });
    }
  };

  const handlePermanentChange = (e) => {
    setPermanentAddress({
      ...permanentAddress,
      [e.target.name]: e.target.value,
    });
    if (sameAsPermanent) {
      setCurrentAddress({
        ...currentAddress,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleChange = (e) => {
    setCurrentAddress({
      ...currentAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setCurrentAddress({
      ...currentAddress,
      state: selectedState,
      district: "",
      taluka: "",
    });
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setCurrentAddress({
      ...currentAddress,
      district: selectedDistrict,
      taluka: "",
    });
  };
  const handleConfirmBox=(e)=>{
    e.preventDefault();
  
    setShowConfirmBox(true)
  }
  const handleSubmit = async (confirmed) => {
  
    if (confirmed) {
      console.log(currentAddress, permanentAddress);
      try {
        const response = await fetch(
          `${apiUrl}/scholarship/applyAd`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: decodedToken.userId,
              permanent_address: permanentAddress,
              current_address: currentAddress,
            }),
          }
        );

        if (response.ok) {
          console.log("Address details saved successfully");
          setAlertSettings({
            type: "success",
            message: "Address Details Saved Successfully",
          });
          setShowAlert(true);
         
          // Add logic for successful submission
        } else {
          console.error("Failed to save address details");
          // Add logic for failed submission
        }
      } catch (error) {
        console.error("Error saving address details:", error);
        // Add logic for error
      }
    }
  };
  return (
    <>
    {showConfirmBox && (
        <ConfirmBox
          message="Are you Sure you want to Save ? Once Saved you wont be able to Edit the details"

          onConfirm={handleSubmit}
        />
      )}
      {showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert} // Pass function reference here
        />
      )}
      <h2>Address Details:</h2>
      <hr />
      <div className="d-flex align-content-center">
        {!showAlert && (
          <form className="row g-3" onSubmit={handleConfirmBox}>
            <div className="col-12">
              <label htmlFor="inputAddress" className="form-label">
                <b>Permanent Address</b>
              </label>
              <input
                type="text"
                className="form-control"
                id="inputAddress"
                name="address"
                value={permanentAddress.address}
                onChange={handlePermanentChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="permanentCity" className="form-label">
                City/Village
              </label>
              <input
                type="text"
                className="form-control"
                id="permanentCity"
                name="city"
                value={permanentAddress.city}
                onChange={handlePermanentChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="permanentPincode" className="form-label">
                Pincode
              </label>
              <input
                type="text"
                className="form-control"
                id="permanentPincode"
                name="pincode"
                value={permanentAddress.pincode}
                onChange={handlePermanentChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="permanentState" className="form-label">
                State
              </label>
              <select
                className="form-select"
                id="permanentState"
                name="state"
                value={permanentAddress.state}
                onChange={handlePermanentChange}
                required
              >
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="permanentDistrict" className="form-label">
                District
              </label>
              <select
                className="form-select"
                id="permanentDistrict"
                name="district"
                value={permanentAddress.district}
                onChange={handlePermanentChange}
                required
              >
                <option value="">Select District</option>
                {maharashtraData.Maharashtra.districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="permanentTaluka" className="form-label">
                Taluka
              </label>
              <select
                className="form-select"
                id="permanentTaluka"
                name="taluka"
                value={permanentAddress.taluka}
                onChange={handlePermanentChange}
                required
              >
                <option value="">Select Taluka</option>
                {maharashtraData.Maharashtra.talukas[
                  permanentAddress.district
                ]?.map((taluka) => (
                  <option key={taluka} value={taluka}>
                    {taluka}
                  </option>
                ))}
              </select>
            </div>
            {/* Add more permanent address fields here... */}
            <div className="form-check my-2 d-flex mx-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="sameAsPermanent"
                checked={sameAsPermanent}
                onChange={handleCheckboxChange}
              />
              <label
                className="form-check-label mx-2"
                htmlFor="sameAsPermanent"
              >
                Same as Permanent Address
              </label>
            </div>
            <div className="col-12">
              <label htmlFor="inputAddress2" className="form-label">
                <b>Current Address</b>
              </label>
              <input
                type="text"
                className="form-control"
                id="inputAddress2"
                placeholder="Apartment, studio, or floor"
                name="address"
                value={currentAddress.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="currentCity" className="form-label">
                City/Village
              </label>
              <input
                type="text"
                className="form-control"
                id="currentCity"
                name="city"
                value={currentAddress.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="currentPincode" className="form-label">
                Pincode
              </label>
              <input
                type="text"
                className="form-control"
                id="currentPincode"
                name="pincode"
                value={currentAddress.pincode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="currentState" className="form-label">
                State
              </label>
              <select
                className="form-select"
                id="currentState"
                name="state"
                value={currentAddress.state}
                onChange={handleStateChange}
                required
              >
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="currentDistrict" className="form-label">
                District
              </label>
              <select
                className="form-select"
                id="currentDistrict"
                name="district"
                value={currentAddress.district}
                onChange={handleChange}
                required
              >
                <option value="">Select District</option>
                {maharashtraData.Maharashtra.districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="currentTaluka" className="form-label">
                Taluka
              </label>
              <select
                className="form-select"
                id="currentTaluka"
                name="taluka"
                value={currentAddress.taluka}
                onChange={handleChange}
                required
              >
                <option value="">Select Taluka</option>
                {maharashtraData.Maharashtra.talukas[
                  currentAddress.district
                ]?.map((taluka) => (
                  <option key={taluka} value={taluka}>
                    {taluka}
                  </option>
                ))}
              </select>
            </div>
            {/* Add more current address fields here... */}
            <div className="buttons my-3 d-flex flex-column">
              <button type="submit" className="btn btn-success my-2">
                Save
              </button>
              <button type="reset" className="btn btn-danger my-1">
                Clear
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default AddressDetails;
