require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-config.json");

const app = express();
app.use(cors());
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.send("Express Server Running!");
});

// Firebase Admin initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// This is from your existing code to verify tokens
app.post("/verifyToken", async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ userId: decodedToken.uid });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// NEW: Survey submission route
app.post("/submitSurvey", async (req, res) => {
  const surveyData = req.body; // e.g., { name, birthDate, education, city, ... }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // 2) Compose the email
    const mailOptions = {
      from: process.env.MAIL_USER,         // Sender
      to: process.env.MAIL_USER,        // Change to desired recipient(s)
      subject: "AI Survey Submission",
      text: JSON.stringify(surveyData, null, 2), // Quick way to send the data
    };

    // 3) Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Survey email sent:", info.messageId);

    // 4) Respond to the client
    return res.status(200).json({ success: true, info: info.messageId });
  } catch (error) {
    console.error("Error sending survey email:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
