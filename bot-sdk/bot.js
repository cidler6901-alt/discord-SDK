// bot-sdk/bot.js
import express from "express";
import fetch from "node-fetch";
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const app = express();
const PORT = process.env.PORT || 8000;

client.once("ready", () => {
  console.log("discord-SCK bot online");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "profile") {
    interaction.reply("discord-SCK profile system online ✅");
  }

  if (interaction.commandName === "link") {
    interaction.reply("Account linking coming soon 🔗");
  }
});

client.login(process.env.BOT_TOKEN);

// Middleware
app.use(express.json());

// OAuth endpoint
app.post("/link-oauth", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing code" });

  try {
    // Exchange code for token
    const params = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: "https://discord-sdk.onrender.com/link-oauth",
      scope: "identify",
    });

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const tokenData = await tokenRes.json();
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData = await userRes.json();

    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OAuth failed" });
  }
});

// Dummy endpoint for Render
app.get("/", (_, res) => res.send("discord-SCK bot running"));

app.listen(PORT, () => console.log(`Bot HTTP server on port ${PORT}`));
