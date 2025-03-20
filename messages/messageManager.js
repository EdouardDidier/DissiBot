const MessageBuilder = require("./messageBuilder.js");
const VoteBuilder = require("./voteBuilder.js");
const PaginatorBuilder = require("./paginatorBuilder.js");

module.exports = class MessageManager {
  // Create a normal message
  static create() {
    return new MessageBuilder();
  }

  // Create a message allowing users to vote
  static createVote(func, args) {
    return new VoteBuilder(func, args);
  }

  // Create a message with multiple pages
  static createPaginator(ownerId, intro, data, func) {
    return new PaginatorBuilder(ownerId, intro, data, func);
  }
};
