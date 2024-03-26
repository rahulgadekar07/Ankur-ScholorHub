import React from "react";

const Erroralert = (props) => {
  return (
    <div>
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
       {props.error_message}
        {/* <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button> */}
      </div>
    </div>
  );
};

export default Erroralert;
