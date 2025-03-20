var Promise = require("promise");

const Command = require("../command.js");

module.exports = class Help extends Command {
  constructor(commandManager) {
    let infos = {
      name: "help",
      group: Constants.group.general,
      description: `Permet d'avoir la liste des commandes ainsi que les détails de leur utilisation.`,
      example: ["", "<cmd>"],
      nbArgsMax: 1,
    };

    super(commandManager, infos);
  }

  execute(msg, args = []) {
    return new Promise((resolve, reject) => {
      // In case of no argument we show all possible commands to the user
      if (args.length == 0) {
        let commands = this.commandManager.commands;
        let group = {};

        // Creating a list of command by group to be display to the user
        for (var k in commands) {
          if (group[commands[k].group] == undefined) {
            group[commands[k].group] = [];
          }

          group[commands[k].group].push(Constants.prefix + k);
        }

        // Creating first part of the message
        let rep = MessageManager.create()
          .setColor(Constants.color.info)
          .setTitle(Constants.title.info)
          .setMessage(
            `Utilisez **${Constants.prefix}help <cmd>** pour avoir plus d'informations sur une commande.`,
          );

        // Adding all command to the message
        for (var k in group) {
          let str = "";
          group[k].forEach((val) => {
            str += val + "\t\t\t\t";
          });
          rep.addField(k, str);
        }

        // Send the message
        rep.send(msg.channel);
      } else {
        let title;
        let str;

        // Check if the command exists, if not, send a generic message to the user
        // to inform that it does't
        if (this.commandManager.commands[args[0]] == undefined) {
          title = Constants.title.info;
          str = `"**${args[0]}**" n'est pas reconnu en tant que commande, essayez **${Constants.prefix}help** pour avoir la liste des commandes`;
        } else {
          // Otherwise provide specific information related to the command
          title = `Commande: ${args[0]}`;

          let cmd = this.commandManager.commands[args[0]];
          var expl = "";

          // Build an exemple on how to use the command
          cmd.example.forEach((e) => {
            expl += ` | ${Constants.prefix}${cmd.name} ${e}`;
          });
          expl = expl.slice(3);

          // Obtain the description of the command
          str = `${cmd.description}`;
        }

        MessageManager.create()
          .setColor(Constants.color.info)
          .setTitle(title)
          .setMessage(str)
          .setFooter(`Utilisation: ${expl}`)
          .send(msg.channel);
      }

      resolve();
    });
  }
};
