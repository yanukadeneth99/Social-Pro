const kue = require("kue");
const logger = require("../logger");

try {
  const queue = kue.createQueue();
  module.exports = queue;
} catch (err) {
  logger.error(`Error using Kue at kue.js : ${err}`);
}
