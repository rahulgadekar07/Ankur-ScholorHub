/* About.js */

import React, { useState, useEffect } from 'react';
import '../Styles/About.css';

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = [
    { id: 1, src: '/slider_images/IMG-20220402-WA0000.jpg', alt: 'Image 1' },
    { id: 2, src: '/slider_images/IMG-20220402-WA0001.jpg', alt: 'Image 2' },
    { id: 3, src: '/slider_images/IMG-20220402-WA0002.jpg', alt: 'Image 3' },
    { id: 4, src: '/slider_images/IMG-20220402-WA0003.jpg', alt: 'Image 4' },
    { id: 5, src: '/slider_images/IMG-20220402-WA0004.jpg', alt: 'Image 5' },
    { id: 6, src: '/slider_images/IMG-20220402-WA0005.jpg', alt: 'Image 6' },
    { id: 7, src: '/slider_images/IMG-20220402-WA0006.jpg', alt: 'Image 7' }
  ];

  useEffect(() => {
    showSlides(slideIndex);
  }, [slideIndex]);

  const showSlides = (index) => {
    const slideWidth = document.querySelector('.slides').clientWidth;
    const offset = -index * slideWidth;
    document.querySelector('.slides').style.transform = `translateX(${offset}px)`;
  };

  const prevSlide = () => {
    const newIndex = slideIndex === 0 ? slides.length - 1 : slideIndex - 1;
    setSlideIndex(newIndex);
  };

  const nextSlide = () => {
    const newIndex = slideIndex === slides.length - 1 ? 0 : slideIndex + 1;
    setSlideIndex(newIndex);
  };

  return (
    <div className="slider">
      <button className="slider-btn prev-btn" onClick={prevSlide}></button>
      <div className="slides">
        {slides.map(slide => (
          <div key={slide.id} className="slide">
            <img src={slide.src} alt={slide.alt} className="slide-image" />
          </div>
        ))}
      </div>
      <button className="slider-btn next-btn" onClick={nextSlide}></button>
    </div>
  );
};

const About = () => {
  return (
    <div className="about-container   ">
      <div className="about-content d-flex flex-column ">
        <h1 className="title">Welcome to Ankur Foundation!</h1>
        <p className="about-description">
          Ankur Foundation is a non-profit organization dedicated to providing educational opportunities, healthcare assistance, and community development initiatives to underprivileged communities. Our mission is to empower individuals and families to break the cycle of poverty and achieve their full potential.
        </p>
        <Slider />
      </div>
      <div className="additional-info mb-2 ">
        <h2>Our Mission</h2>
        <p>
          At Ankur Foundation, our mission is to uplift marginalized communities by providing access to quality education, healthcare services, and sustainable livelihood opportunities. We believe in creating lasting change through empowerment and community development.
        </p>
        <h2>Our Programs</h2>
        <p>
          We offer a range of programs aimed at addressing the holistic needs of individuals and communities. Our programs include educational scholarships, healthcare clinics, vocational training, women's empowerment initiatives, and environmental conservation projects.
        </p>
        <h2>Get Involved</h2>
        <p>
          Join us in our mission to make a positive impact in the lives of those in need. Whether through volunteering, fundraising, or spreading awareness, every contribution counts towards creating a brighter future for all.
        </p>
      
      </div>
    </div>
  );
};

export default About;
