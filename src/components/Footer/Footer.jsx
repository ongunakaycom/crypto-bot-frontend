import React from 'react';
import './Footer.css';
import {
  FaInstagram,
  FaTelegram,
  FaYoutube,
  FaFacebook
} from 'react-icons/fa';



// Twitter (X) logo (from public folder)
const TwitterXLogo = () => (
  <img
    src="/img/twitter-x-seeklogo-2.svg"
    alt="Twitter X"
    width="40"
    height="40"
  />
);

// TradingView logo (from public folder)
const TradingViewLogo = () => (
  <img
    src="/img/white-short-logo.svg"
    alt="TradingView"
    width="40"
    height="40"
  />
);

const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footerCopy text-center">

        {/* Twitter (X) */}
        <a
          href="https://x.com/crypto_public"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <TwitterXLogo />
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/robinhoodtradebot/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaInstagram size={24} style={{ color: '#E4405F' }} />
        </a>

        {/* Telegram */}
        <a
          href="https://t.me/RobinHoodCryptoTradersClub"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaTelegram size={24} style={{ color: '#0088cc' }} />
        </a>

        {/* YouTube */}
        <a
          href="https://www.youtube.com/@RobinHoodCryptoTradersClub"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaYoutube size={24} style={{ color: '#FF0000' }} />
        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/cryptotradersclubsocial"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaFacebook size={24} style={{ color: '#1877F2' }} />
        </a>

        {/* TradingView */}
        <a
          href="https://www.tradingview.com/u/CryptoSignalsChannel/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <TradingViewLogo />
        </a>

      </div>
    </footer>
  );
};

export default Footer;
