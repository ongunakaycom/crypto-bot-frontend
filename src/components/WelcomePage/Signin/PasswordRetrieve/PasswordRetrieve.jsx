import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../../firebase'; // Import Firebase auth from firebase.js
import './PasswordRetrieve.css'; // Use the unique CSS file for styling
import Footer from '../../../Footer/Footer';
import WelcomePageHeader from '../../WelcomePageHeader/WelcomePageHeader';

const ForgetPasswordComponent = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      // Send password reset email with Firebase Auth
      await sendPasswordResetEmail(auth, email);
      // Set success message
      setMessage('Password reset email sent!');
      setError(null); // Clear any previous error messages
    } catch (err) {
      // Catch error and set the error message for UI display
      setError(err.message);
      setMessage(null); // Clear any previous success messages
    }
  };

  return (
    <div className='AyaFormPage'>
      <WelcomePageHeader></WelcomePageHeader>
      <main className='form-page-content'>
        <div className='form-page-container'>
          <h2>Reset your password</h2>
          <div className='form-page-form'>
            <form onSubmit={handlePasswordReset}>
              <label className='text-start text-light'>
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

              <button type='submit' className='submit-button'>
                Send Reset Email
              </button>
            </form>
          </div>
          {message && <div className='fp-success-message'>{message}</div>}
          {error && <div className='error-message'>{error}</div>}

          <a href="/signin" >
            Remembered your password? Sign In
          </a>

          <a href="/" className='back-to-home'>
            ← Back to Home
          </a>
        </div>
      </main>

     <Footer/>
    </div>
  );
};

export default ForgetPasswordComponent;
