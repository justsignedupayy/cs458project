import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router"; // 1) Import useRouter

// Import your Firebase auth functions (adapted for React Native!)
import { signInWithEmail, signInWithGoogle } from "../src/firebase-config";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 2) Create a router instance
  const router = useRouter();

  const handleEmailLogin = async () => {
    setError(""); // clear any previous error

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const response = await signInWithEmail(email, password);
    if (!response.success) {
      setError(response.error);
    } else {
      // 3) Navigate to survey page
      console.log("User signed in:", response.user);
      router.push("/survey");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // If successful, navigate as well
      console.log("User signed in with Google");
      router.push("/survey");
    } catch (err) {
      console.log("Google Sign-In Error:", err);
      setError("Google Sign-In failed. Please check your native integration.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Our App</Text>
      <Text style={styles.subtitle}>Please sign in to continue.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
        <Text style={styles.buttonText}>Sign in with Email</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

// Example styling using React Native's StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,              // take up full screen
    backgroundColor: "#fff",
    alignItems: "center", // center horizontally
    justifyContent: "center", // center vertically
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    width: "80%",
    backgroundColor: "#3366FF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  googleButton: {
    width: "80%",
    backgroundColor: "#FF5454",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orText: {
    marginVertical: 12,
    fontSize: 16,
  },
});
