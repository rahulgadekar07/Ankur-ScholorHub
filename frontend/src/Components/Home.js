import React, { useState, useEffect } from "react";
import "../Styles/Home.css";
import { Link } from "react-router-dom";
import Spinner from "../Components/Alerts/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
const Home = () => {
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    // Simulate map loading delay
    const timer = setTimeout(() => {
      setMapLoading(false);
    }, 2000);

    // Cleanup function
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex my-3">
      {/* Google Maps Location */}
      <div className="map1 m-4 ">
        {mapLoading && (
          <div className="loading-overlay  m-3">
            <center>
              <div className="spinner"></div>
            </center>
          </div>
        )}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d78927.99469480693!2d74.20176019628322!3d17.56172028944616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc3d310ed3ab985%3A0xb4dc1b253d1d8a3d!2z4KS14KWH4KSz4KWCIOCkl-CljeCksOCkvuCkriDgpKrgpILgpJrgpL7gpK_gpKQ!5e0!3m2!1sen!2sin!4v1713689725651!5m2!1sen!2sin"
          width="100%"
          height="40%"
          style={{
            border: "0",
            borderRadius: "20px",
            display: mapLoading ? "none" : "block",
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setMapLoading(false)} // Update loading state when map is loaded
        ></iframe>
      </div>
      <div className="content1 container text-center">
        <div
          className="newscontent"
          onMouseEnter={() => document.getElementById("marquee").stop()}
          onMouseLeave={() => document.getElementById("marquee").start()}
        >
          <marquee
            id="marquee"
            behavior="scroll"
            direction="up"
            scrollamount="7"
          >
            <div className="marquee-item">
              <p className="my-2">
                This is marquee 1 Lorem ipsum, dolor sit amet consectetur
                adipisicing elit. Architecto necessitatibus fugit ipsam
                pariatur. Quibusdam perferendis eaque nemo inventore, nihil,
                libero velit, officiis cumque sint adipisci sunt et accusantium
                vel provident.
              </p>
            </div>
            <div className="marquee-item">
              <p className="my-2">
                This is marquee 2 Lorem ipsum, dolor sit amet consectetur
                adipisicing elit. Architecto necessitatibus fugit ipsam
                pariatur. Quibusdam perferendis eaque nemo inventore, nihil,
                libero velit, officiis cumque sint adipisci sunt et accusantium
                vel provident.
              </p>
            </div>
            <div className="marquee-item">
              <p className="my-2">
                This is marquee 3 Lorem ipsum, dolor sit amet consectetur
                adipisicing elit. Architecto necessitatibus fugit ipsam
                pariatur. Quibusdam perferendis eaque nemo inventore, nihil,
                libero velit, officiis cumque sint adipisci sunt et accusantium
                vel provident.
              </p>
            </div>
          </marquee>
        </div>

        <div className="maincontent">
          <h1>Welcome to Ankur Foundation</h1>
          <p>Click below to apply for our scholarships:</p>
          <div className="apl">
            <Link id="btn1" to="/apply">
              Apply
            </Link>
          </div>
          <p>Kindly Donate Us to Help more Students:</p>
          <div className="apl1">
            <button id="btn2">Donate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
