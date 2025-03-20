var Promise = require("promise");

const Command = require("../command.js");

module.exports = class Ping extends Command {
  constructor(commandManager) {
    let infos = {
      name: "ping",
      group: Constants.group.general,
      description: `Donne les temps de latence DissiBot/API et DissiBot/Serveur.`,
      example: [""],
      nbArgsMax: 0,
    };

    super(commandManager, infos);
  }

  execute(msg, args = []) {
    return new Promise((resolve, reject) => {
      let startPing = new Date().getTime();

      // Send a message and compute the time it took to be received by the bot
      MessageManager.create()
        .setColor(Constants.color.info)
        .setMessage(`pong!`)
        .send(msg.channel)
        .then((msg) => {
          let endPing = new Date().getTime();

          // Then edit the message with the ping data
          MessageManager.create()
            .setColor(Constants.color.info)
            .setMessage(`pong!`)
            .addField(`API`, `${Math.round(msg.client.ping)} ms`, true)
            .addField(
              `${msg.guild != null ? msg.guild.name : "Messagerie"}`,
              `${endPing - startPing} ms`,
              true,
            )
            .edit(msg);
        })
        .catch(console.error);
      resolve();
    });
  }
};
