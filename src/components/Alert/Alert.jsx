// src/components/Alert.js
import React from 'react';
import './Alert.css'; // Add styles for the alert

const Alert = ({ message, type }) => {
  if (!message) return null;

  return (
    <div className={`alert ${type}`}>
      {message}
    </div>
  );
};

export default Alert;