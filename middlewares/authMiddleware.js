const jwt = require("jsonwebtoken");
const { Organisation, User } = require("../models");

exports.checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, "your_jwt_secret", (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

exports.checkOrganisationAccess = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { orgId } = req.params;

    const organisation = await Organisation.findOne({
      where: { orgId },
      include: {
        model: User,
        where: { userId },
      },
    });

    if (!organisation) {
      return res.status(403).json({
        status: "Forbidden",
        message: "Access denied",
        statusCode: 403,
      });
    }

    next();
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Error checking access",
      statusCode: 400,
    });
  }
};
