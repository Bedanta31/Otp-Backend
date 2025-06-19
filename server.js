import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Twilio } from "twilio";

dotenv.config();
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const client = new Twilio(process.env.AC563c913d7ecb177ac5d3ee040d81ddc8, process.env.535829adeb5be7b634a644c2db557f26);
const verifySid = process.env.VAc34fa8ca92e3e8f75989b3af24f76b55;

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
