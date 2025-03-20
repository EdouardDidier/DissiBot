var Promise = require('promise');

const Command = require('../command.js');

module.exports = class Skip extends Command {
  constructor(commandManager) {
    let infos = {
      name: 'skip',
      group: Constants.group.music,
      description: `Permet de passer la musique en cours.`,
      example: [''],
      nbArgsMax: 0
    }

    super(commandManager, infos);
  }

  execute(msg, args = []) {
    return new Promise((resolve, reject) => {
      var musicPlayer = this.commandManager.getMusicPlayer(msg);
      if (musicPlayer == null) return;

      if (!musicPlayer.isPlaying()) {
        MessageManager.create()
          .setColor(Constants.color.error)
          .setTitle(Constants.title.music)
          .setMessage(`Aucune musique en cours, utilisez **${Constants.prefix}request** pour ajouter des musiques à la playlist`)
          .send(msg.channel);
      } else {
        if (musicPlayer.getMode() == 'FREE') {
          musicPlayer.skip(msg.channel);
        }
        else if (musicPlayer.getMode() == 'VOTE') {
          MessageManager.createVote(function(args) {
            args[0].skip(args[1].channel);
          }, [musicPlayer, msg])  //TODO: Mettre dans le musicplayer le VoteBuilder
            .setColor(Constants.color.success)
            .setTitle(Constants.title.music)
            .setMessage(`Vote pour skipper la musique en cours`)
            .send(msg.channel);
        }
        else {
          MessageManager.create()
            .setColor(Constants.color.error)
            .setTitle(Constants.title.music)
            .setMessage(`Le skipmode est actuellement **NONE**, il n'est donc pas possible de skipper la musique`)
            .send(msg.channel);
        }
      }
      resolve();
    });
  }
}
