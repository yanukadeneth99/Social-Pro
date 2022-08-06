// Database
const mongoose = require("mongoose");
const env = require("./environment");
const logger = require("../logger");

mainProcess().catch((err) => {
  logger.error(`Error when connecting to the Database at db.js : ${err}`);
  return;
});

//* Write all Processes inside this
async function mainProcess() {

  await mongoose.connect(`mongodb://${env.database.ip}:${env.database.port}/${env.database.name}`);


  logger.info(
    `Connected Successfully to the DB : ${env.database.name} at IP : ${env.database.ip}:${env.database.port}`
  );
}
