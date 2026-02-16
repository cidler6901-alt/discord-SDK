// bot-sdk or api/server.js
import express from "express";
import fetch from "node-fetch"; // make sure node-fetch is installed

const app = express();
app.use(express.json());

// Allow CORS from your frontend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://cidler6901-alt.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/link-oauth", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    // Exchange code for token
    const params = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: "https://cidler6901-alt.github.io/discord-SDK/web-sdk/"
    });

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) return res.status(400).json(tokenData);

    // Get user info
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const userData = await userRes.json();
    res.json(userData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to link Discord account" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Bot API running on", PORT));
