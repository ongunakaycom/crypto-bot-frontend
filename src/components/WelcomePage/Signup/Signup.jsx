import React, { useState } from "react";
import { database } from "../../../firebase"; // Import Firebase database from firebase.js
import { ref, set } from "firebase/database"; // Firebase Database functions
import { getFirestore, doc, setDoc} from "firebase/firestore"; //addDoc, , onSnapshot
import "./Signup.css"; 
import Footer from "../../Footer/Footer"; 
import WelcomePageHeader from "../WelcomePageHeader/WelcomePageHeader"; 
import { useNavigate } from "react-router-dom"; 
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import HCaptcha from "@hcaptcha/react-hcaptcha"; // Import hCaptcha component
import Alert from '../../Alert/Alert'; 

const SignUpComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); 
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  // Function to validate email domains
  const isValidEmailDomain = (email) => {
    const bannedDomains = [
      "tempmail.com",
      "mailinator.com",
      "10minutemail.com",
      "guerrillamail.com",
      "throwawaymail.com",
      "sharklasers.com",
      "yopmail.com",
      "discard.email",
      "maildrop.cc",
      "temp-mail.org",
    ]; // List of banned domains

    const domain = email.split("@")[1];
    const subDomainCheck = bannedDomains.some(bannedDomain => domain.endsWith(bannedDomain));
    return !bannedDomains.includes(domain) && !subDomainCheck;
  };

  // Function to check if the email is disposable
  const isDisposableEmail = (email) => {
    const disposableDomains = [
      "disposable.com",
      "trashmail.com",
      "mailinator.com",
      "tempmail.com",
      "10minutemail.com",
      "guerrillamail.com",
      "throwawaymail.com",
      "yopmail.com",
      "discard.email",
      "maildrop.cc",
      "temp-mail.org",
    ]; // List of disposable domains

    const domain = email.split("@")[1];
    return disposableDomains.includes(domain) || disposableDomains.some(d => domain.endsWith(d));
  };

  // Function to handle hCaptcha token change
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Store the CAPTCHA token
  };

  const displayAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  // Main function to handle signup
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate CAPTCHA
    if (!captchaToken) {
      displayAlert("Please complete the CAPTCHA to proceed.", "error");
      return;
    }

    // Validate email domain
    if (!isValidEmailDomain(email)) {
      displayAlert("The email domain is not allowed. Please use a valid email address.", "error");
      return;
    }

    // Check for disposable email addresses
    if (isDisposableEmail(email)) {
      displayAlert("Disposable email addresses are not allowed.", "error");
      return;
    }

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });
      await sendEmailVerification(user);

      // Display alert message and delay before redirection
      setAlertMessage("Signup completed! Redirecting you to the verification process...");
      setShowAlert(true);

      // Save user details directly into the main database
      const userRef = ref(database, "users/" + user.uid); // Save directly to "users"
      await set(userRef, {
        email: email,
        username: username,
        verified: false,
      });

      const firestore = getFirestore();
      const defaultAvatar = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'; 
      const ur = doc(firestore, "users", user.uid);
      await setDoc(ur, {
        displayName: username,
        email: email,
        photoURL: defaultAvatar,
        datingLocations: ["World"],
        datingVenues: ["Wonline"],
        createdAt: new Date(),
      });

      displayAlert("Signup successful! Redirecting to the verification process...", "success");
      setTimeout(() => {
        navigate("/verification");
      }, 3000);
    } catch (err) {
      // Handle specific Firebase Auth errors
      let errorMessage;
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email address is already registered. Please log in or use a different email.";
          break;
        case "auth/invalid-email":
          errorMessage = "The email address format is invalid. Please check your email and try again.";
          break;
        case "auth/weak-password":
          errorMessage = "The password you entered is too weak. Please use a stronger password.";
          break;
        default:
          errorMessage = "An unexpected error occurred during sign-up. Please try again later.";
      }
      displayAlert(errorMessage, "error");
    }
  };

  return (
    <div className="AyaFormPage">
      <WelcomePageHeader />
      <main className="form-page-content">
        <div className="form-page-container">
          <h2> Create your account </h2>
          {showAlert && (
            <Alert
              message={alertMessage}
              type={alertType}
              onClose={() => setShowAlert(false)}
            />
          )}
          <div className="form-page-form">
            <form onSubmit={handleSignUp}>
              <label className="text-start text-light">
                Name:
                <input
                  className="w-100"
                  type="text"
                  placeholder="How should I call you?"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
              <label className="text-start text-light">
                Email:
                <input
                  className="w-100"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="text-start text-light">
                Password:
                <input
                  className="w-100"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <div className="hcaptcha-container">
                <HCaptcha
                  sitekey="f1e8f8a6-578e-4476-ab32-80bc848e9bf2" // Replace with your hCaptcha site key
                  onVerify={handleCaptchaChange} // Callback to handle token
                />
              </div>
              <a href="/signin"> Already have an account? Sign In </a>
              <br></br>
              <button type="submit" className="submit-button">
                Sign Up
              </button>
            </form>
          </div>

          <a href="/" className="back-to-home">
            ← Back to Home
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpComponent;
