import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import './CookieDisclaimer.css';

function CookieDisclaimer() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    if (!cookieAccepted) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <Alert variant="dark" className="cookie-disclaimer fixed-bottom mb-0">
      <Container>
        <Row className="align-items-center">
          <Col sm={8}>
            <span>
            We use cookies to enhance your browsing experience. By using this website, you agree to our{' '}
              <a href="/privacy-policy">Privacy Policy</a>.
            </span>
          </Col>
          <Col sm={4} className="text-md-end mt-2 mt-md-0">
            <Button className="accept-button" onClick={handleAccept}>
                Accept
            </Button>
          </Col>
        </Row>
      </Container>
    </Alert>
  );
}

export default CookieDisclaimer;
