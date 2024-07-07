const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/users/:id", authMiddleware.checkToken, authController.getUserById);

router.get("/organisations", authMiddleware.checkToken, authController.getOrganizations);
router.get(
  "/organisations/:orgId",
  authMiddleware.checkToken,
  authMiddleware.checkOrganisationAccess,
  authController.getOrganisationById
);
router.post(
  "/organisations",
  authMiddleware.checkToken,
  authMiddleware.checkOrganisationAccess,
  authController.createOrganization
);
router.post(
  "/organisations/:orgId/users",
  authMiddleware.checkToken,
  authController.addUserToOrganization
);

module.exports = router;
