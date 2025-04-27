import React, { useState, useEffect } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import Alert from '../../Alert/Alert'; 
import './ChatInput.css';
import { firestore } from '../../../firebase';
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";  // Import Firebase Authentication

const ChatInput = ({ inputText, setInputText, onSubmit, isSending }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [isProAccount, setIsProAccount] = useState(false); // Default to false for safety
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [userId, setUserId] = useState(null);

  // Fetch the user ID and account status from Firestore
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserId(user.uid);  // Get the user ID from Firebase Authentication
    } else {
      console.log("No user is logged in.");
      setIsLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (!userId) return;  // If no userId, don't try fetching user data

    // Fetch the user data from Firestore once userId is available
    const fetchAccountStatus = async () => {
      try {
        const userRef = doc(firestore, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const accountStatus = (userData.accountStatus || '').trim(); // Trim to handle any spaces
          
          setIsProAccount(accountStatus.toLowerCase() === 'pro'); // Ensure case-insensitive comparison
        } else {
          setIsProAccount(false);
          setAlertMessage('Your account is not Pro. You need to upgrade to Pro.');
        }
      } catch (error) {
        console.error("Error fetching account status:", error);
        setIsProAccount(false);
        setAlertMessage('Error verifying account status. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountStatus();
  }, [userId]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!inputText.trim()) {
      setAlertMessage('Please type something');
      setTimeout(() => setAlertMessage(''), 3000);
      return;
    }

    onSubmit(event);
  };

  if (isLoading) {
    return <div className="chat-input-form">Loading account status...</div>;
  }

  return (
    <div>
      {alertMessage && <Alert message={alertMessage} type="error" />}

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isProAccount ? (isSending ? "Robin Hood typing..." : "Type here...") : "Upgrade to Pro to chat"}
          className="chat-text-input"
          disabled={!isProAccount || isSending}
        />
        <button 
          type="submit" 
          className="submit-button-send-message" 
          disabled={!isProAccount || isSending || !inputText.trim()}
        >
          <AiOutlineSend size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
