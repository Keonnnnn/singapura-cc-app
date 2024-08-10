import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import {Link} from "react-router-dom";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../carousel.css'; // Ensure this path matches your CSS file location
import carousell1 from '../assets/carousell1.png';
import carousel2 from '../assets/carousel2.png';
import carousel3 from '../assets/carousel3.jpg';

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleChange = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div>
      <div className="static-overlay">
        <h1 className="header-text">JOIN OUR<br />COMMUNITY</h1>
        <Link to='/register'>
          <button className="cta-button">Join Now</button>
        </Link>
      </div>
      <div className="carousel-container">
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          centerMode
          centerSlidePercentage={40} // Adjust this to control the visible part of the adjacent slides
          swipeable={true}
          selectedItem={currentIndex}
          onChange={handleChange}
        >
          <div className={`carousel-slide ${currentIndex === 0 ? 'center-slide' : ''}`}>
            <img src={carousell1} alt="Slide 1" />
          </div>
          <div className={`carousel-slide ${currentIndex === 1 ? 'center-slide' : ''}`}>
            <img src={carousel2} alt="Slide 2" />
          </div>
          <div className={`carousel-slide ${currentIndex === 2 ? 'center-slide' : ''}`}>
            <img src={carousel3} alt="Slide 3" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default Home;
