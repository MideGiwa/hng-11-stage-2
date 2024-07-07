const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("test", "midegiwa", "Cr33py9in3", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;
