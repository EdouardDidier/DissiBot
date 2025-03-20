require("dotenv").config();
const Discord = require("discord.js");

global.Constants = require("./util/constants.js");
global.Tools = require("./util/tools.js");
global.MessageManager = require("./messages/messageManager.js");

const CommandManager = require("./commands/commandManager.js");

var bot = new Discord.Client();

var commandManager = new CommandManager();

// Listen to message on every channels
bot.on("message", (msg) => {
  if (msg.author.bot) return; // Ignore messages from bots

  // Ignore messages that doesn't start with the defined prefix
  if (!msg.content.startsWith(Constants.prefix)) return;

  // Parsing of the message into command
  let args = msg.content.split(" ");
  for (i = 0; i < args.length; i++) {
    if (args[i] === "") {
      args.splice(i, 1);
      i--;
    }
  }

  let cmd = args[0].slice(1);
  args = args.slice(1);

  // Execute the command
  commandManager.execute(msg, cmd, args);
});

// Initialization of the bot
bot.on("ready", () => {
  console.log(`Connected to:`);

  bot.guilds.array().forEach((guild) => {
    console.log(`\t- ${guild.name}`);
  });

  console.log(`\nReady!`);
});

// Login to Discord
bot.login(process.env.DISCORD_API_TOKEN);
