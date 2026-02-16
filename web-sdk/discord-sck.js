import express from "express";
import fetch from "node-fetch"; // Needed to call Discord API

const app = express();
app.use(express.json());

app.post("/link-oauth", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    // Exchange code for access token
    const params = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.REDIRECT_URI,
      scope: "identify"
    });

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    const tokenData = await tokenRes.json();

    // Fetch user info
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const userData = await userRes.json();

    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to link OAuth" });
  }
});

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => res.send("discord-SCK bot running"));
app.listen(PORT, () => console.log("Bot HTTP dummy server on", PORT));
