var Promise = require("promise");

// Template for command classes
module.exports = class Command {
  constructor(commandManager, infos) {
    this.name = infos.name; // Name to invoke the command

    this.group = infos.group; // Defining the group of the command (usefull for the help command)

    this.description = infos.description;
    this.example = infos.example; // An example on how to use the command

    // Defining the minimum permission level to use the command or 0 if undefined
    this.permissionLevel =
      infos.permissionLevel == undefined ? 0 : infos.permissionLevel;

    // Defining the minimum and maximum of argument to use the command
    this.nbArgsMax = infos.nbArgsMax != undefined ? infos.nbArgsMax : 100;
    this.nbArgsMin = infos.nbArgsMin != undefined ? infos.nbArgsMin : -1;

    this.commandManager = commandManager;
  }

  // Template for the function to call when the command is used
  execute(msg, args = []) {
    return new Promise((resolve, reject) => {
      console.log("[WARN] Command not defined");
      resolve();
    });
  }
};
