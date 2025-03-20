const MusicPlayer = require("../musicplayer/musicPlayer.js");

const commandsFile = "./commands";

module.exports = class CommandManager {
  constructor() {
    this.commands = {};
    this.musicPlayer = {};

    // Go through the "command" directory and add valid command classes as command
    Tools.getFilePath(commandsFile, [
      "commandManager.js",
      "command.js",
    ]).forEach((path) => {
      //TODO: Improve te get only files in subdirectory (remove exclude and root))
      let tmpCmd = new (require("../" + path))(this); // Change to / if running on Linux
      this.commands[tmpCmd.name] = tmpCmd;
    });
  }

  execute(msg, cmd, args) {
    if (this.commands[cmd] == undefined) {
      // Check if the command exist, else send a message to invite to use the "help" command
      MessageManager.create()
        .setColor(Constants.color.info)
        .setTitle(Constants.title.info)
        .setMessage(
          `Commande non reconnue, utilisez **${Constants.prefix}help** pour avoir la liste des commandes`,
        )
        .send(msg.channel);

      return;
    }

    // Check if the user has permission to use the command
    if (!Tools.hasPermission(this.commands[cmd].permissionLevel, msg.member)) {
      MessageManager.create()
        .setColor(Constants.color.error)
        .setTitle(Constants.title.error)
        .setMessage(`Vous n'avez pas la permission d'utiliser cette commande.`)
        .send(msg.channel);

      return;
    }

    // Check if the number of argument is correct, else send a message to invite to use the "help" command
    if (
      args.length < this.commands[cmd].nbArgsMin ||
      args.length > this.commands[cmd].nbArgsMax
    ) {
      MessageManager.create()
        .setColor(Constants.color.error)
        .setTitle(Constants.title.error)
        .setMessage(
          `Nombre d'argument invalide, essayez **${Constants.prefix}help ${cmd}** pour plus d'informations`,
        )
        .send(msg.channel);

      return;
    }

    this.commands[cmd].execute(msg, args).catch(console.error);
  }

  getMusicPlayer(msg) {
    //TODO: voiceConnection == member.voiceConnection ?
    if (msg.guild == null || msg.member.voiceChannel == null) {
      MessageManager.create()
        .setColor(Constants.color.error)
        .setTitle(Constants.title.music)
        .setMessage(
          `Les commandes musicales doivent être envoyées depuis un salon textuel du serveur où vous êtes connecté`,
        )
        .send(msg.channel);

      return null;
    }

    // Check if a music player exist otherwise create one
    if (this.musicPlayer[msg.guild.name] == undefined)
      this.musicPlayer[msg.guild.name] = new MusicPlayer(msg.guild);

    return this.musicPlayer[msg.guild.name];
  }
};
