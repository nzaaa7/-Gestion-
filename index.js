const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Token du bot (Railway va le mettre en variable d'environnement)
const TOKEN = process.env.TOKEN;

client.once("ready", () => {
  console.log("Bot connecté !");

  // Statut violet “en live”
  client.user.setActivity("/hakumu +help 🇫🇷", {
    type: "STREAMING",
    url: "https://twitch.tv/discord" // obligatoire pour le violet
  });
});

// Commande simple
client.on("messageCreate", message => {
  if(message.content.toLowerCase() === "/hakumu +help") {
    message.reply("Salut 🇫🇷! Ton bot est actif et en ligne 😎");
  }
});

client.login(TOKEN);
