import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  getDocs,
  where,
  doc,
  deleteDoc  // Added deleteDoc import
} from 'firebase/firestore';

// Your Firebase configuration object
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
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
const signInWithEmail = async (email, password) => {
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

const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

const getSurveys = async (userId) => {  // Add userId parameter
  try {
    const surveysRef = collection(db, 'surveys');
    const q = query(surveysRef, where('userId', '==', userId)); // Add where clause
    const querySnapshot = await getDocs(q);

    const surveys = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, surveys };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const addSurvey = async (surveyData, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'surveys'), {
      ...surveyData,
      userId  // Add userId field to document
    });
    return {
      success: true,
      id: docRef.id
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Added deleteSurvey function
const deleteSurvey = async (surveyId) => {
  try {
    await deleteDoc(doc(db, 'surveys', surveyId));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export {
  auth,
  db,
  googleProvider,
  signInWithEmail,
  registerWithEmail,
  resetPassword,
  getSurveys,
  addSurvey,
  deleteSurvey,  // Added to exports
  collection,
  addDoc
};