import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';  
import './CookieDisclaimer.css';

function CookieDisclaimer() {
  const { t } = useTranslation();  // Initialize translation hook
  const [show, setShow] = useState(true);  // Default to showing the disclaimer

  // Handle the "accept" button click to just hide the disclaimer
  const handleAccept = () => {
    setShow(false); // Hide the cookie disclaimer after accepting
  };

  if (!show) {
    return null; // If show is false, render nothing
  }

  return (
    <Alert variant="dark" className="cookie-disclaimer fixed-bottom mb-0">
      <Container>
        <Row className="align-items-center">
          <Col sm={8}>
            <span>
              {t('cookieDisclaimer.messagePart1')}
              <span style={{ textDecoration: 'underline' }}>
                {t('cookieDisclaimer.termsLinkText')}
              </span>
            </span>
          </Col>
          <Col sm={4} className="text-md-end mt-2 mt-md-0">
            <Button className="accept-button" onClick={handleAccept}>
              {t('cookieDisclaimer.acceptButton')}
            </Button>
          </Col>
        </Row>
      </Container>
    </Alert>
  );
}

export default CookieDisclaimer;
