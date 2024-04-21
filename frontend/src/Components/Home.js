import React from "react";
import "../Styles/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex my-3">
      <div className="content1 container text-center">
        <h1>Welcome to Ankur Foundation</h1>
        <p>Click below to apply for our scholarships:</p>
        <div className="apl">
          <Link id="btn1" to="/apply">Apply</Link>
        </div>
        <p>Kindly Donate Us to Help more Students:</p>
        <div className="apl1">
          <button id="btn2">Donate</button>
        </div>
        {/* Google Maps Location */}
        <div class="map1">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243459.6580825091!2d74.19140651553963!3d17.55246518313358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc3d28c80dffafd%3A0x50cd40035ce738c7!2sVelu%2C%20Maharashtra%20415511!5e0!3m2!1sen!2sin!4v1649227331809!5m2!1sen!2sin"
            width="100%" height="40%" style={{border:'0'} }allowfullscreen="" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>


      </div>
    </div>
  );
};

export default Home;
