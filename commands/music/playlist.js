var Promise = require('promise');

const Command = require('../command.js');

module.exports = class Playlist extends Command {
  constructor(commandManager) {
    let infos = {
      name: 'playlist',
      group: Constants.group.music,
      description: `Affiche l'essemble des musiques ajoutées à la playlist.`,
      example: [''],
      nbArgsMax: 0
    }

    super(commandManager, infos);
  }

  execute(msg, args = []) { //TODO: Vérifier que le player joue, vérifier que la queue n'est pas vide
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
        if (musicPlayer.getQueue().length == 0) {
        MessageManager.create()
          .setColor(Constants.color.success)
          .setTitle(Constants.title.music)
          .setMessage(`La playlist est vide, utilisez **${Constants.prefix}request** pour ajouter des musiques`)
          .addSongMessage(musicPlayer.getCurrent())
          .send(msg.channel);
        } else {
          MessageManager.createPaginator(msg.author.id, 'Liste de lecture:', musicPlayer.getQueue(), function(val) {
            return `[${val.title}](${val.url}) (${Tools.secondsToMinutes(val.length_seconds)}), ajouté par <@${val.author.id}>`;
          }).setColor(Constants.color.success)
            .setTitle(Constants.title.music)
            .send(msg.channel);
        }
      }
      resolve();
    });
  }
}
