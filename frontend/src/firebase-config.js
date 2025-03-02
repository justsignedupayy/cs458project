import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDjE1uvLm11OkSZ1EEHwlFatphAcHUelGE",
  authDomain: "cs458-c77f5.firebaseapp.com",
  projectId: "cs458-c77f5",
  storageBucket: "cs458-c77f5.firebasestorage.app",
  messagingSenderId: "273785606312",
  appId: "1:273785606312:web:5ef6665350622390c2f29d",
  measurementId: "G-003GYRGNNK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();

    const response = await fetch("http://localhost:8000/verifyToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    console.log("User signed in with Google:", result.user);
    console.log(data);
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Email and password cannot be empty.");
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let errorMessage = "An unknown error occurred.";

    // Check Firebase's raw error message
    if (error.code === "auth/invalid-credential") {
      errorMessage = "Invalid email or password. Please try again.";
    } else {
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        default:
          errorMessage = error.message;
      }
    }

    console.error("Email/Password Sign-In Error:", errorMessage);
    return { success: false, error: errorMessage };
  }
};
