import React, { useState } from "react";
import { signInWithGoogle, signInWithEmail } from "./firebase-config";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error message

  const handleEmailLogin = async () => {
    setError(""); // Reset error before trying to log in

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const response = await signInWithEmail(email, password);
    if (!response.success) {
      setError(response.error); // Show detailed error message
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Our App</h1>
      <p>Please sign in to continue.</p>

      {/* Display error message */}
      {error && <p style={errorStyle}>{error}</p>}

      {/* Email & Password Login */}
      <div style={inputContainerStyle}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleEmailLogin} style={buttonStyle}>Sign in with Email</button>
      </div>

      {/* Google Login */}
      <p>or</p>
      <button onClick={signInWithGoogle} style={googleButtonStyle}>Sign in with Google</button>
    </div>
  );
}

// Styles
const errorStyle = {
  color: "red",
  fontSize: "14px",
  marginBottom: "10px"
};

const inputContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px"
};

const inputStyle = {
  padding: "10px",
  width: "250px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "5px"
};

const googleButtonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#4285F4",
  color: "white",
  border: "none",
  borderRadius: "5px"
};

export default LoginPage;
