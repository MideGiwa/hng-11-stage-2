const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Organization extends Model {}

Organization.init(
  {
    orgId: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Organization",
  }
);

module.exports = Organization;
