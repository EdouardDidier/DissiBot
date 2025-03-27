var Promise = require('promise');

const Command = require('../command.js');

module.exports = class Ping extends Command {
  constructor(commandManager) {
    let infos = {
      name: '',
      group: Constants.group.general,
      description: ``,
      example: [''],
      nbArgsMax: 0
    }

    super(commandManager, infos);
  }

  execute(msg, args = []) {
    return new Promise((resolve, reject) => {

      resolve();
    });
  }
}
