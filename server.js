import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());


const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const verifySid = process.env.TWILIO_VERIFY_SID;

app.get("/", (req, res) => {
  res.send("World Finder OTP backend is running 🔥");
});

app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  try {
    await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: "sms" });

    res.json({ success: true });
  } catch (error) {
    console.error("OTP Send Error:", error);
    res.json({ success: false, message: error.message });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { phone, code } = req.body;

  try {
    const check = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code });

    if (check.status === "approved") {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("OTP Verify Error:", error);
    res.json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
