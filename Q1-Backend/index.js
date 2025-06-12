const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());

let cachedToken = null;

async function getToken() {
  if (cachedToken) return cachedToken;
  const res = await axios.post('http://20.244.56.144/evaluation-service/auth', {
    email: process.env.EMAIL,
    name: process.env.NAME,
    rollNo: process.env.ROLL_NO,
    accessCode: process.env.ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  cachedToken = res.data.access_token;
  return cachedToken;
}

app.get('/api/stocks/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { minutes } = req.query;
  const token = await getToken();

  const url = `http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const prices = response.data.map(p => p.price);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

  res.json({ averageStockPrice: avg, priceHistory: response.data });
});

app.listen(8000, () => console.log("Backend running on http://localhost:8000"));
