import React from 'react';
import './Footer.css';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footerCopy text-center">
        © 2024 Aya Matchmaker | Follow us on{' '}
        <a
          href="https://www.instagram.com/ayamatchmaker"
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-link"
        >
          Instagram <FaInstagram size={16} style={{ marginLeft: '5px' }} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
