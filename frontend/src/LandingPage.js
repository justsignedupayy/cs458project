import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import SurveyPage from "./SurveyPage"; // Import the SurveyPage component
import "./LandingPage.css"; // Import CSS for background styling

function LandingPage({ user }) {
  const [activePage, setActivePage] = useState('dashboard');

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = "/"; // Redirect to login page after logout
  };

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard':
        return (
          <div className="landing-card">
            <h1>Login Successful!</h1>
            <h2>Welcome, {user.displayName}</h2>
            <img src={user.photoURL} alt="User Profile" width="100" className="profile-image" />
            <p>Email: {user.email}</p>
            <div className="navigation-buttons">
              <button 
                onClick={() => setActivePage('surveys')} 
                className="nav-button"
              >
                Go to Surveys
              </button>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          </div>
        );
      case 'surveys':
        return (
          <div className="survey-container">
  <button 
    onClick={() => setActivePage('dashboard')} 
    style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '0.6rem 1.2rem',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      margin: '1rem 0',
      fontSize: '1rem',
      display: 'inline-block',
      ':hover': {
        backgroundColor: '#34495e'
      }
    }}
  >
    ← Back to Dashboard
  </button>
  <SurveyPage user={user} />
</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="landing-container">
      {renderContent()}
    </div>
  );
}

export default LandingPage;