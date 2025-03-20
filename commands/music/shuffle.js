var Promise = require('promise');

const Command = require('../command.js');

module.exports = class Shuffle extends Command {
  constructor(commandManager) {
    let infos = {
      name: 'shuffle',
      group: Constants.group.music,
      description: `Mélange la playlist.`,
      example: [''],
      nbArgsMax: 0
    }

    super(commandManager, infos);
  }

  execute(msg, args = []) {
    return new Promise((resolve, reject) => {
      var musicPlayer = this.commandManager.getMusicPlayer(msg);
      if (musicPlayer == null) return;

      let rep = MessageManager.create()
                  .setTitle(Constants.title.music);

      if (musicPlayer.getQueue().length < 2) {
          rep.setColor(Constants.color.error)
             .setMessage(`La playlist est vide ou ne contient qu'une chanson, mélanger n'est pas utile`);
      } else {
        musicPlayer.shuffle();

        rep.setColor(Constants.color.success)
           .setMessage(`La playlist a été mélangée!`);
      }

      rep.send(msg.channel);

      resolve();
    });
  }
}
