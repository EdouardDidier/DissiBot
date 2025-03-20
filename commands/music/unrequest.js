var Promise = require('promise');

const Command = require('../command.js');

module.exports = class Unrequest extends Command {
  constructor(commandManager) {
    let infos = {
      name: 'unrequest',
      group: Constants.group.music,
      description: `Retire une musique de la playlist.`,
      example: ['<index>'],
      nbArgsMin: 1,
      nbArgsMax: 1
    }

    super(commandManager, infos);
  }

  execute(msg, args = []) { //TODO: if no args, unrequest last from user
    return new Promise((resolve, reject) => {
      var musicPlayer = this.commandManager.getMusicPlayer(msg);
      if (musicPlayer == null) return;

      var rep = MessageManager.create().setTitle(Constants.title.music);

      if (isNaN(args[0]))
        rep.setColor(Constants.color.error).setMessage(`Saisie incorrecte, essayez **${Constants.prefix}help unrequest** pour plus d'informations`);
      else {
        var song = musicPlayer.removeRequest(args[0] - 1);
        if (song == null)
          rep.setColor(Constants.color.error).setMessage(`Aucune musique en position ${args[0]}`);
        else rep.setColor(Constants.color.success).setMessage(`**[${song.title}](${song.url})** (${Tools.secondsToMinutes(song.length_seconds)}) a été retirée de la playlist`);
      }

      rep.send(msg.channel);

      resolve();
    });
  }
}
