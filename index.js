const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Token sécurisé via variable d'environnement
const TOKEN = process.env.TOKEN;

// Quand le bot est prêt
client.once("ready", () => {
  console.log("Bot connecté !");

  // Statut violet “en live”
  client.user.setActivity("/hakumu +help 🇫🇷", {
    type: "STREAMING",
    url: "https://twitch.tv/twitch" // obligatoire pour le violet
  });
});

// Commande +help → envoie le panel en DM
client.on("messageCreate", async (message) => {
  if(message.content === "+help") {
    await message.author.send(
      "📌 **Commandes disponibles :**\n" +
      "+help → Panel d'aide en DM\n" +
      "+giveaway <temps> <nombre_gagnants> <récompense> → Crée un giveaway"
    );
    message.reply("📩 Je t’ai envoyé le panel en DM !");
  }
});

// Commande +giveaway avec timer et nombre de gagnants
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("+giveaway")) return;
  if (!message.member.permissions.has("Administrator")) return message.reply("❌ Tu n’as pas la permission.");

  const args = message.content.split(" ").slice(1);
  if (!args[0] || !args[1] || !args[2]) return message.reply("❌ Utilisation : `+giveaway 10m 2 Nitro`");

  const time = args.shift();
  const winnersCount = parseInt(args.shift());
  const prize = args.join(" ");

  if (isNaN(winnersCount) || winnersCount < 1) return message.reply("❌ Nombre de gagnants invalide.");

  // Timer
  const timeRegex = /^(\d+)(s|m|h|d)$/;
  if (!timeRegex.test(time)) return message.reply("❌ Format du temps invalide (ex: 10m, 1h, 1d)");

  const [, amount, unit] = time.match(timeRegex);
  let duration = amount * 1000;
  if (unit === "m") duration *= 60;
  if (unit === "h") duration *= 60 * 60;
  if (unit === "d") duration *= 60 * 60 * 24;

  // Embed giveaway
  const embed = new EmbedBuilder()
    .setTitle("🎉 GIVEAWAY 🎉")
    .setDescription(`🎁 **Récompense :** ${prize}\n💎 Réagis avec 💎 pour participer !\n⏱️ Fin dans : **${time}**\n🏆 Nombre de gagnants : ${winnersCount}`)
    .setColor("#a970ff")
    .setFooter({ text: "Giveaway 🇫🇷" })
    .setTimestamp();

  const giveawayMessage = await message.channel.send({ embeds: [embed] });
  await giveawayMessage.react("💎");

  // Fin du giveaway
  setTimeout(async () => {
    const fetchedMsg = await message.channel.messages.fetch(giveawayMessage.id);
    const reaction = fetchedMsg.reactions.cache.get("💎");
    if (!reaction || reaction.count <= 1) return message.channel.send("❌ Pas assez de participants.");

    const users = await reaction.users.fetch();
    const participants = users.filter(u => !u.bot);

    if (participants.size < winnersCount) {
      return message.channel.send("❌ Pas assez de participants pour le nombre de gagnants demandé.");
    }

    // Tirage des gagnants
    let winners = [];
    const participantsArray = Array.from(participants.values());
    for (let i = 0; i < winnersCount; i++) {
      const winner = participantsArray.splice(Math.floor(Math.random() * participantsArray.length), 1)[0];
      winners.push(winner);
    }

    message.channel.send(`🎊 Félicitations ${winners.map(w => `<@${w.id}>`).join(", ")} ! Vous avez gagné **${prize}** 💎`);
  }, duration);
});

// Lancement du bot
client.login(TOKEN);
