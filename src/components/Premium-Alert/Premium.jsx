import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Card, Button, ListGroup } from 'react-bootstrap'; // Keep Alert for usage
import { useNavigate } from 'react-router-dom';
import './Premium.css';
const PremiumAlert = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  const [showAlert, setShowAlert] = useState(false);
    
  useEffect(() => {
    if (!userId) return;

    const premiumRef = ref(db, `users/${userId}/isPremium`);
    const unsubscribePremium = onValue(premiumRef, (snapshot) => {
      const isPremium = !!snapshot.val();
      setShowAlert(!isPremium); // Show alert if not premium
    });

    return () => {
      unsubscribePremium();
    };
  }, [db, userId]);

  const handleUpgradeAccount = () => {
    navigate('/go-premium');
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  if (showAlert) {
    return (
      <div className="custom-alert">
        <Card className="text-center p-4 mb-4 position-relative-card">
          <button
            className="custom-close-btn"
            onClick={handleCloseAlert} // Close the alert when clicked
            aria-label="Close"
          >
            &times;
          </button>

          <Card.Body>
            <Card.Subtitle className="mb-2 text-muted">
              You are currently using <br /> the Free Version of AyaMatch
            </Card.Subtitle>

            <Card.Title className="mb-3 text-dark font-weight-bold title-card-title">
              Premium Features
            </Card.Title>

            <ListGroup className="list-unstyled mb-3">
              <ListGroup.Item>Access to Exclusive Events</ListGroup.Item>
              <ListGroup.Item>Profile Customization</ListGroup.Item>
              <ListGroup.Item>Matchmaker Assistance</ListGroup.Item>
              <ListGroup.Item>Unlimited Messaging with Matches</ListGroup.Item>
            </ListGroup>

            <Card.Text className="text-dark font-weight-bold fs-6">
              Upgrade to premium account to unlock these features!
            </Card.Text>

            <Button className="btn-dark fs-6 me-2 alert-button" onClick={handleUpgradeAccount}>
              Upgrade to Premium Account
            </Button>

            <Button className="btn-dark fs-6 alert-button" onClick={handleCloseAlert}>
              Continue with Free Account
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return null; // No alert to show
};

export default PremiumAlert;
