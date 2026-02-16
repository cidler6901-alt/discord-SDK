import { Client, GatewayIntentBits } from "discord.js";


const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

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

/* ---- Dummy server for Render ---- */
const app = express();
const PORT = process.env.PORT || 800;

app.get("/", (req, res) => {
  res.send("discord-SCK bot running");
});

app.listen(PORT, () => {
  console.log("Bot HTTP dummy server on", PORT);
});
