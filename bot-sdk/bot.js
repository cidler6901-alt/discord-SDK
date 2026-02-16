import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const CLIENT_ID = "1471857321696166072";
const CLIENT_SECRET = process.env.CLIENT_SECRET; // Discord bot client secret
const REDIRECT_URI = "https://discord-sdk.onrender.com/link-oauth";

app.post("/link-oauth", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        scope: "identify"
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.status(400).json(tokenData);

    // Get user info
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData = await userRes.json();

    // Return user info to web
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to link Discord account" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Bot HTTP server running on", PORT));
