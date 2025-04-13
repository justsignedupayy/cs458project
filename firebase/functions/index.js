const { onRequest } = require("firebase-functions/v2/https");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");

admin.initializeApp();

exports.submitSurvey = onRequest(
  {
    secrets: ["GMAIL_USER", "GMAIL_PASS"],
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        return res.status(400).send("Only POST requests are accepted");
      }

      const surveyData = req.body;

      // CORRECTED: Access via process.env
      const gmailUser = process.env.GMAIL_USER;
      const gmailPass = process.env.GMAIL_PASS;

      if (!gmailUser || !gmailPass) {
        throw new Error("Missing GMAIL credentials from Secret Manager.");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      const mailOptions = {
        from: gmailUser,
        to: gmailUser, // Consider using a different recipient email
        subject: "AI Survey Submission (v2)",
        text: JSON.stringify(surveyData, null, 2),
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.messageId);
      
      return res.status(200).json({ success: true, info: info.messageId });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);