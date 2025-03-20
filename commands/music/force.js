var Promise = require("promise");

const Command = require("../command.js");

module.exports = class Forceskip extends Command {
  constructor(commandManager) {
    let infos = {
      name: "force",
      group: Constants.group.music,
      description: `Exécute une commande en ignorant les modes restreignant leur utilisation.`,
      example: ["<cmd>"],
      permissionLevel: 1,
      nbArgsMin: 1,
    };

    super(commandManager, infos);
  }

  execute(msg, args = []) {
    return new Promise((resolve, reject) => {
      var musicPlayer = this.commandManager.getMusicPlayer(msg);
      if (musicPlayer == null) return;

      // Bypass restrictions on the skip and stop command induced by certain mode of the musicplayer
      if (args[0] == "skip") musicPlayer.skip(msg.channel);
      else if (args[0] == "stop") musicPlayer.stop(msg.channel);
      else this.commandManager.execute(msg, args[0], args.slice(1));

      resolve();
    });
  }
};
