import React, { useState, useEffect } from "react";
import "./WelcomePage.css";
import { Container, Row, Col, Button} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAnalytics, logEvent } from "firebase/analytics";
import Footer from "../Footer/Footer";
import CookieDisclaimer from "./CookieDisclaimer/CookieDisclaimer.jsx";
import WelcomePageHeader from "./WelcomePageHeader/WelcomePageHeader.jsx";
import { useTranslation } from 'react-i18next';

function WelcomePage() {
  const analytics = getAnalytics();
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const { t } = useTranslation();

  const handleGuestChat = () => {
    navigate("/guestchat");  
  };

  const handleLearnMore = () => {
    navigate("/about"); 
  };

  useEffect(() => {   
    const fetchUserCount = async () => {
      try {
        const response = await fetch('https://us-central1-aya-cloudfunctions.cloudfunctions.net/app/getusercount');
        if (response.ok) {
          const data = await response.json();
          setUserCount(data.count);
        } else {
          console.error("Error fetching user count:", response.statusText);
          setUserCount(0);
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
        setUserCount(0);
      }
    };
    fetchUserCount();
    return () => {};
  }, []);

  useEffect(() => {
    logEvent(analytics, "welcome_page_visit");
  }, [analytics]);

  return (
    <div className="WelcomePage">
      <WelcomePageHeader />
      <main className="welcome-container">
        <Container>
          <Row className="text-end">
            <span className={`user-count-navbar`}>
              User Count: {userCount}
            </span>
          </Row>
          <Row>
            <Col md={6} className="w-100">
              <h1 className={`mb-4`} >
                {t('heading')}
              </h1>
              <p>
                Aya is your Dr. Love and modern Matchmaker
              </p>
            </Col>
          </Row>
          <Row>
            <p><img src="/img/aya-avatar.jpg" alt="Avatar" className="ayaphoto" /></p>
            <p>
            <Button onClick={handleGuestChat}>Chat with me</Button> or <Button onClick={handleLearnMore}>Learn more</Button>
            </p>            
          </Row>
          <Row>
            <span className="small text-white mb-2">
              <b>No</b> wait time - <b>No</b> cost<br /><b>No</b> strings attached - <b>No</b> login required
            </span>
            </Row>
        </Container>
      </main>
      <Footer /> 
      <CookieDisclaimer />
    </div>
  );
}
export default WelcomePage;
