const { Client, GatewayIntentBits } = require("discord.js");

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
