const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    userId: user.userId,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

module.exports = {
  generateToken,
};
