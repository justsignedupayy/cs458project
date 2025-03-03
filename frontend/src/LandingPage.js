import React from "react";
import { getAuth, signOut } from "firebase/auth";
import "./LandingPage.css"; // Import CSS for background styling

function LandingPage({ user }) {
  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = "/"; // Redirect to login page after logout
  };

  return (
    <div className="landing-container">
      {/* User Information */}
      <div className="landing-card">
        <h1>Login Successful!</h1>
        <h2>Welcome, {user.displayName}</h2>
        <img src={user.photoURL} alt="User Profile" width="100" className="profile-image" />
        <p>Email: {user.email}</p>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>
    </div>
  );
}

export default LandingPage;
