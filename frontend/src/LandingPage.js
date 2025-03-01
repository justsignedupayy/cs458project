import React from "react";
import { getAuth, signOut } from "firebase/auth";

function LandingPage({ user }) {
  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = "/"; // Redirect to login page after logout
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login Successful!</h1>
      <h2>Welcome, {user.displayName}</h2>
      <img src={user.photoURL} alt="User Profile" width="100" style={{ borderRadius: "50%" }} />
      <p>Email: {user.email}</p>
      <button onClick={logout} style={buttonStyle}>Logout</button>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#ff3b30",
  color: "white",
  border: "none",
  borderRadius: "5px",
  marginTop: "20px"
};

export default LandingPage;
