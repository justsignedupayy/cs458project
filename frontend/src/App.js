import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";
import { auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/landing" />} />
        <Route path="/landing" element={user ? <LandingPage user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
