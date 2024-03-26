import React from "react";
import "../Styles/Home.css";
const Home = () => {
  return (
    <div className="flex my-3 ">
      <div className="content1 container text-center">
        <h1>Welcome to Ankur Foundation</h1>
        <p>Click below to apply for our scholorships:</p>
        <div className="apl">
          <button id="btn1">Apply</button>
        </div>
        <p> Kindly Donate Us to Help more Students:-</p>
        <div className="apl1">
          <button id="btn2">Donate</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
