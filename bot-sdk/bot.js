import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";

dotenv.config();
const app = express();
app.use(express.json());

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once("ready", () => console.log("discord-SCK bot online"));
client.login(process.env.BOT_TOKEN);

// ---- Discord OAuth2 Endpoint ----
app.post("/link-oauth", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing code" });

  try {
    // Exchange code for access token
    const data = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: "https://cidler6901-alt.github.io/discord-SDK/web-sdk/",
      scope: "identify"
    });

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data
    });

    const tokenJson = await tokenRes.json();
    if (!tokenJson.access_token) return res.status(400).json({ error: "Invalid code" });

    // Fetch user info
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` }
    });

    const user = await userRes.json();
    res.json(user); // send user info back to frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to link Discord account" });
  }
});

// ---- Dummy HTTP server for Render ----
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Bot API running on port", PORT));
