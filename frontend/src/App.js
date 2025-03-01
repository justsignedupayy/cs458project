import logo from './logo.svg';
import './App.css';
import React from "react";
import { signInWithGoogle } from "./firebase-config";

function App() {
  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default App;
