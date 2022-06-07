const { Sequelize } = require("sequelize");
const { errorLogger, infoLogger } = require("../utils/logger");

const username = process.env.MDB_USERNAME || "";
const pwd = encodeURIComponent(process.env.MDB_PASSWORD) || "";
const url = process.env.MDB_URL;

const ramenDB = new Sequelize(`mariadb://${username}:${pwd}@${url}/ramen`, {
  dialect: "mariadb",
  logging: false,
  // logging: console.log,
  timeout: 6000,
  freezeTableName: true,
  pool: {
    max: 15,
    min: 0,
    idle: 10000,
    acquire: 60000,
  },
});

function authenticateDB(database, dbName) {
  database
    .authenticate()
    .then(() =>
      infoLogger.info(`[MariaDB] Successfully connected to '${dbName}'...`)
    )
    .catch((error) =>
      errorLogger.error(`[MariaDB] '${dbName}': Connection failed, ${error}`)
    );
}
authenticateDB(ramenDB, "ramenDB");

module.exports = {
  ramenDB,
};
