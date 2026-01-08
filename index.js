const { 
  Client, 
  GatewayIntentBits, 
  ActivityType 
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔹 PRÉFIXE
const prefix = "+";

client.once("ready", () => {
  console.log(`✅ Bot connecté : ${client.user.tag}`);

  // 🔴 STATUT LIVE
  client.user.setPresence({
    activities: [{
      name: "les commandes | +help",
      type: ActivityType.Streaming,
      url: "https://twitch.tv/discord"
    }],
    status: "online"
  });
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // 🔹 COMMANDES
  if (command === "ping") {
    return message.reply("🏓 Pong !");
  }

  if (command === "help") {
    return message.reply(
      "**📜 Commandes disponibles :**\n" +
      "`+ping` → test du bot\n" +
      "`+help` → liste des commandes\n" +
      "`+say <texte>` → faire parler le bot\n" +
      "`+avatar` → avatar de l'utilisateur"
    );
  }

  if (command === "say") {
    if (!args.length) {
      return message.reply("❌ Tu dois écrire un message.");
    }
    return message.channel.send(args.join(" "));
  }

  if (command === "avatar") {
    return message.reply(message.author.displayAvatarURL({ dynamic: true }));
  }
});

client.login(process.env.TOKEN);
