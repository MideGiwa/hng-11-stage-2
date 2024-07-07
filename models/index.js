const User = require("./User");
const Organization = require("./Organisation");

User.belongsToMany(Organization, { through: "UserOrganizations" });
Organization.belongsToMany(User, { through: "UserOrganizations" });

module.exports = {
  User,
  Organization,
};
