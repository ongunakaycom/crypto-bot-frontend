import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';
import Footer from '../Footer/Footer';
import './CheckoutForm.css';
import { useNavigate } from 'react-router-dom';

const GoPremium = () => {
  const navigate = useNavigate();
  const [setSuccessMessage] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false); // New state to track subscription

  const handleSubscribe = (event) => {
    event.preventDefault();
    setSuccessMessage('Congratulations! You have a 1-month free premium subscription.');
    setIsSubscribed(true); // Set the subscription state to true
  };

  const handleContinueWithFreeAccount = () => {
    navigate('/dashboard'); // Navigate to the /dashboard route
  };

  return (
    <div className="Dashboard"> {/* Use the Dashboard class here */}
      <DashboardHeader />
      <main className="dashboard-content"> {/* Added main element */}
        <div className="d-flex justify-content-center" style={{ marginTop: '20px' }}>
          <Card className="premium-card rounded shadow p-4" style={{ width: '100%', maxWidth: '600px' }}>
            <Card.Body>
              <h2 className="text-dark mb-4 text-center">Go Premium</h2>
              <p className="text-dark mb-4 text-center">
                Enjoy 1 month free, then just <span className="font-weight-bold">$9.99/month!</span>
              </p>
              {/* If not subscribed, show buttons */}
              {!isSubscribed ? (
                <>
                  <Button 
                    variant="dark" 
                    onClick={handleSubscribe} 
                    className="fs-6 w-100 mb-2 checkout-form"
                    style={{ color: 'white' }} // Add this line
                  >
                    Start Your Free Month
                  </Button>
                  <Button 
                    variant="light" 
                    className="btn-secondary fs-6 w-100 checkout-form" 
                    onClick={handleContinueWithFreeAccount}
                    style={{ color: 'white' }} // Add this line
                  >
                    Continue with Free Account
                  </Button>
                </>
              ) : (
                <Button 
                  variant="dark" 
                  onClick={() => navigate('/dashboard')} 
                  className="fs-6 w-100 mt-3 checkout-form"
                  style={{ color: 'white' }} // Add this line ///
                >
                  Enjoy Your Premium Account
                </Button>
              )}
            </Card.Body>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GoPremium;
