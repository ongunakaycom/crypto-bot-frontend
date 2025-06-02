import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Lazy-loaded components
const WelcomePage = React.lazy(() => import('./components/WelcomePage/WelcomePage'));
const Dashboard = React.lazy(() => import('./components/Dashboard/Dashboard.jsx'));
const SignupWithEmail = React.lazy(() => import('./components/WelcomePage/Signup/Signup'));
const Signin = React.lazy(() => import('./components/WelcomePage/Signin/Signin'));
const PasswordRetrieve = React.lazy(() => import('./components/WelcomePage/Signin/PasswordRetrieve/PasswordRetrieve'));
const AccountSettings = React.lazy(() => import('./components/Dashboard/Account-Settings/Account-Settings'));
const VerificationPage = React.lazy(() => import('./components/WelcomePage/Signup/VerificationPage/VerificationPage.jsx'));
const ProtectedRoute = React.lazy(() => import('./components/WelcomePage/ProtectedRoute/ProtectedRoute.jsx'));

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<div className="text-center mt-5">Loading, please wait...</div>}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<SignupWithEmail />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/password-retrieve" element={<PasswordRetrieve />} />
            <Route
              path="/account-settings"
              element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              }
            />
            <Route path="/verification" element={<VerificationPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;