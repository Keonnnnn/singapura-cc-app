import React, { useState } from 'react';
import './Footer.css';
import logo from '../assets/logo.png';
import facebook from '../assets/facebook.png';
import instagram from '../assets/instagram.png';
import twitter from '../assets/twitter.png';
import qr from '../assets/QR.png';
import visa from '../assets/visa.png';
import master from '../assets/master.png';
import axios from '../http';

function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/subscribe', { name, email });
      setMessage('Subscription successful');
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-subscribe">
        <h2>The best of Singapura CC delivered straight to you!</h2>
        <form className="subscribe-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Name*" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="email" 
            placeholder="Email Address*" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">SUBSCRIBE</button>
        </form>
        {message && <p>{message}</p>}
      </div>
      <div className="footer-content">
        <div className="footer-section footer-logo">
          <img src={logo} alt="Mascot" />
          <h3>SINGAPURA CC</h3>
          <p>Empowering Singaporeans through Community Connection!</p>
        </div>
        <div className="footer-section footer-social">
          <h3>Social</h3>
          <div className="social-icons">
            <p><img src={facebook} alt="Facebook" /> @singapuraCCsg</p>
            <p><img src={twitter} alt="Twitter" /> @singapuraCCsg</p>
            <p className="instagram"><img src={instagram} className="instagram" alt="Instagram" /> @singapuraCCsg</p>
          </div>
        </div>
        <div className="footer-section footer-donate">
          <h3>Donate</h3>
          <p>Would you like to donate to help out with our events? Feel free to scan the QR code or pay via credit/debit card below to donate!</p>
        </div>
        <div className="footer-section footer-qr">
          <div className="qr-and-payment">
            <img src={qr} alt="QR Code" className="qr" />
            <div className="payment-info">
              <div className="payment-methods">
                <img src={master} alt="Mastercard" />
                <img src={visa} alt="Visa" />
              </div>
              <p>UEN: 09342222PPLOP12224</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
