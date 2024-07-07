const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("defaultdb", "avnadmin", "AVNS_sx-OxiYBL2tynKpFNjd", {
  host: "pg-339b18ac-midegiwa-e046.k.aivencloud.com",
  port: 22744,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false,
});

module.exports = sequelize;
