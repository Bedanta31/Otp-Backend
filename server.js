import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Setup Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Temporary store for OTPs (not for production)
const otpStore = {};

// 🔥 Send OTP manually
app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = otp;

  try {
    // Send custom SMS
    await client.messages.create({
      body: `🔐 Your World Finder Game OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // must be a Twilio number
      to: phone
    });

    res.json({ success: true });
  } catch (error) {
    console.error("SMS Send Error:", error);
    res.json({ success: false, message: error.message });
  }
});

// ✅ Verify OTP
app.post("/verify-otp", (req, res) => {
  const { phone, code } = req.body;

  if (otpStore[phone] && otpStore[phone] === code) {
    delete otpStore[phone]; // clear after use
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Invalid OTP" });
  }
});

app.get("/", (req, res) => {
  res.send("🔥 World Finder Custom OTP Backend Running!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
