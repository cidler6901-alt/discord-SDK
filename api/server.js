import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let users = {}; // temp DB

app.get("/", (req, res) => {
  res.send("discord-SCK API online");
});

app.post("/link", (req, res) => {
  const { discordId, webId } = req.body;
  users[discordId] = { webId, profile: {} };
  res.json({ success: true });
});

app.get("/users/:id", (req, res) => {
  res.json(users[req.params.id] || null);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running on", PORT));
