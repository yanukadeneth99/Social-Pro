const { transports, createLogger, format } = require("winston");

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/app.log" }), //All Logs go here
    new transports.File({ filename: "logs/error.log", level: "error" }), //Error Logs go here
  ],
  exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
  rejectionHandlers: [new transports.File({ filename: "logs/rejections.log" })],
});


/* //* Logger Level Guide
 { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }


  logger.log('silly', "127.0.0.1 - there's no place like home");
  logger.log('debug', "127.0.0.1 - there's no place like home");
  logger.log('verbose', "127.0.0.1 - there's no place like home");
  logger.log('info', "127.0.0.1 - there's no place like home");
  logger.log('warn', "127.0.0.1 - there's no place like home");
  logger.log('error', "127.0.0.1 - there's no place like home");
  logger.info("127.0.0.1 - there's no place like home");
  logger.warn("127.0.0.1 - there's no place like home");
  logger.error("127.0.0.1 - there's no place like home");
  */

module.exports = logger;