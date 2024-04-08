import React, { useState } from "react";

const AddressDetails = () => {
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    address: "",
    state: "",
    district: "",
    taluka: "",
    city: "",
    pincode: "",
  });

  const [permanentAddress, setPermanentAddress] = useState({
    address: "",
    state: "Maharashtra",
    district: "",
    taluka: " ",
    city: "",
    pincode: "",
  });

  const maharashtraData = {
    Maharashtra: {
      districts: [
        "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", 
        "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", 
        "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", 
        "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", 
        "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", 
        "Washim", "Yavatmal"
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
        Yavatmal: ["Yavatmal", "Pusad", "Umarkhed"]
      },
    },
  };
  
  // If you have data for talukas, you can update the talukas array accordingly.
  

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

  return (
    <div className="d-flex align-content-center">
      <form className="row g-3">
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
            {maharashtraData.Maharashtra.talukas[permanentAddress.district]?.map(
              (taluka) => (
                <option key={taluka} value={taluka}>
                  {taluka}
                </option>
              )
            )}
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
          <label className="form-check-label mx-2" htmlFor="sameAsPermanent">
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
            {maharashtraData.Maharashtra.talukas[currentAddress.district]?.map(
              (taluka) => (
                <option key={taluka} value={taluka}>
                  {taluka}
                </option>
              )
            )}
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
    </div>
  );
};

export default AddressDetails;
