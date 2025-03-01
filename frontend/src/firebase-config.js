import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjE1uvLm11OkSZ1EEHwlFatphAcHUelGE",
  authDomain: "cs458-c77f5.firebaseapp.com",
  projectId: "cs458-c77f5",
  storageBucket: "cs458-c77f5.firebasestorage.app",
  messagingSenderId: "273785606312",
  appId: "1:273785606312:web:5ef6665350622390c2f29d",
  measurementId: "G-003GYRGNNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  
