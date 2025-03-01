import React from "react";
import { signInWithGoogle } from "./firebase-config";

function LoginPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Our App</h1>
      <p>Please sign in to continue.</p>
      <button onClick={signInWithGoogle} style={buttonStyle}>Sign in with Google</button>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#4285F4",
  color: "white",
  border: "none",
  borderRadius: "5px"
};

export default LoginPage;
