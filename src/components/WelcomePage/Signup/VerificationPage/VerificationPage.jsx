import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap"; 
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Alert from "../../../Alert/Alert.jsx"; 

const VerificationPage = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const checkVerification = () => {
        user.reload().then(() => {
          if (user.emailVerified) {
            setAlertMessage("Your email has been verified! Redirecting to Sign In...");
            setAlertVariant("success");
            setShowAlert(true);

            // Redirect to /signin after 3 seconds
            setTimeout(() => {
              navigate("/signin");
            }, 3000);
          } else {
            setAlertMessage("Please check your email to verify your account.");
            setAlertVariant("info");
            setShowAlert(true);
          }
        }).catch((error) => {
          console.error("Error reloading user:", error);
          setAlertMessage("Unable to verify email status. Please try again later.");
          setAlertVariant("danger");
          setShowAlert(true);
        });
      };

      // Check for verification every 3000ms (3 seconds)
      const intervalId = setInterval(checkVerification, 3000);

      // Also check verification when the tab is focused
      const handleFocus = () => {
        checkVerification();
      };

      window.addEventListener("focus", handleFocus);

      // Cleanup the interval and event listener when the component is unmounted
      return () => {
        clearInterval(intervalId);
        window.removeEventListener("focus", handleFocus);
      };
    } else {
      // If no authenticated user, redirect to home
      setAlertMessage("No authenticated user found. Please log in to verify your email.");
      setAlertVariant("warning");
      setShowAlert(true);
      navigate("/");
    }
  }, [navigate]);

  const handleResendEmail = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      user.sendEmailVerification()
        .then(() => {
          setAlertMessage("Verification email resent. Please check your inbox.");
          setAlertVariant("info");
          setShowAlert(true);
        })
        .catch((error) => {
          console.error("Error sending email verification:", error);
          setAlertMessage("Error resending verification email. Please try again later.");
          setAlertVariant("danger");
          setShowAlert(true);
        });
    } else {
      setAlertMessage("No authenticated user found.");
      setAlertVariant("warning");
      setShowAlert(true);
    }
  };

  return (
    <Container className="mt-5 text-center">
      <h2 className="mb-4 text-dark">Verify Your Email</h2>
      
      {showAlert && (
        <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      
      <Alert variant="info">
        We've sent you a verification email. Please check your inbox and follow
        the instructions to verify your account.
      </Alert>
      <Button variant="primary" onClick={handleResendEmail} className="mb-3 fs-6">
        Resend Verification Email
      </Button>
    </Container>
  );
};

export default VerificationPage;
