import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import twilio from 'twilio';

const app = express();
const port = process.env.PORT || 3000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);
const otpStore = new Map();

app.use(cors());
app.use(bodyParser.json());

app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await client.messages.create({
      body: `🔐 Your World Finder Game OTP is: ${otp}`,
      from: twilioNumber,
      to: phone,
    });

    otpStore.set(phone, otp);
    res.send({ success: true, message: 'OTP sent!' });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

app.post('/verify-otp', (req, res) => {
  const { phone, code } = req.body;
  const validOtp = otpStore.get(phone);

  if (code === validOtp) {
    otpStore.delete(phone);
    res.send({ success: true, message: 'OTP verified!' });
  } else {
    res.status(400).send({ success: false, message: 'Invalid OTP' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
