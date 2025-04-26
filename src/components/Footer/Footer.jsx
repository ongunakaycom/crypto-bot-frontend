import React from 'react';
import './Footer.css';
import { FaTwitter, FaInstagram, FaTelegram } from 'react-icons/fa'; // Import icons

const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footerCopy text-center">
        {/* Social Media Links with Icons */}
        <a
          href="https://x.com/crypto_public"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaTwitter size={24} style={{ margin: '0 10px', color: '#1DA1F2' }} />
        </a>
        <a
          href="https://www.instagram.com/robinhoodtradebot/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaInstagram size={24} style={{ margin: '0 10px', color: '#E4405F' }} />
        </a>
        <a
          href="https://t.me/RobinHoodCryptoTradersClub"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaTelegram size={24} style={{ margin: '0 10px', color: '#0088cc' }} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
