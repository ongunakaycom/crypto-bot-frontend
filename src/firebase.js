import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push, query, limitToLast } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics'; // Correct import for Firebase Analytics
import { getFirestore } from 'firebase/firestore'; // Import Firestore functions
import { GoogleGenerativeAI } from '@google/generative-ai';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBHhDtVFO--pYh_U-c7cTHrHgbNPuYY96I",
  authDomain: "aya-matchmaker.firebaseapp.com",
  projectId: "aya-matchmaker",
  storageBucket: "aya-matchmaker.appspot.com",
  messagingSenderId: "154095928723",
  appId: "1:154095928723:web:4a557382befafe4cd89466",
  measurementId: "G-YCV8SS80P1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const generativeModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Export services and functions
export { 
  database, 
  ref, 
  set, 
  onValue, 
  push, 
  query, 
  limitToLast, 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  googleProvider, 
  generativeModel,
  signOut,
  analytics, 
  logEvent,
  firestore // Export Firestore
};
