import React, { useState } from "react";
import { signInWithGoogle, signInWithEmail } from "./firebase-config";
import { motion } from "framer-motion";
import "./LoginPage.css"; // Import CSS for video styling

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

    if (email.length > 255 || password.length > 255) {
      setError("Input too long.");
      return;
    }

    const sqlInjectionPattern = /([';]|--)/;
    if (sqlInjectionPattern.test(email) || sqlInjectionPattern.test(password)) {
      setError("Invalid input detected. Please avoid using special characters.");
      return;
    }

    const response = await signInWithEmail(email, password);
    if (!response.success) {
      setError(response.error); // Show detailed error message
    }
  };

  return (
    <div className="login-container">
      {/* Video Background */}
      <video autoPlay loop muted className="background-video">
        <source src="macintosh.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="login-card"
      >
        <h1>Welcome to Our App</h1>
        <p>Please sign in to continue.</p>

        {/* Display error message */}
        {error && <motion.p className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {error}
        </motion.p>}

        {/* Email & Password Login */}
        <div className="input-container">
          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            whileFocus={{ scale: 1.05 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            whileFocus={{ scale: 1.05 }}
          />
          <motion.button 
            onClick={handleEmailLogin} 
            className="login-button" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign in with Email
          </motion.button>
        </div>

        <p>or</p>

        {/* Google Login */}
        <motion.button 
          onClick={signInWithGoogle} 
          className="google-button" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign in with Google
        </motion.button>
      </motion.div>
    </div>
  );
}

export default LoginPage;
