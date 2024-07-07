const User = require("../models/User");
const Organization = require("../models/Organisation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const generateToken = (user) => {
  return jwt.sign({ userId: user.userId }, "your_jwt_secret", {
    expiresIn: "1h",
  });
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(422).json({
        status: "Bad request",
        message: "All fields are required",
        statusCode: 422,
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(422).json({
        status: "Bad request",
        message: "Email already exists",
        statusCode: 422,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const orgName = `${firstName}'s Organization`;
    const organization = await Organization.create({
      orgId: uuidv4(),
      name: orgName,
      description: `${firstName}'s personal organization.`,
    });

    await user.addOrganization(organization);

    const token = generateToken(user);

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 400,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "Not found",
        message: "User not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Error fetching user",
      statusCode: 400,
    });
  }
};

exports.getOrganizations = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: Organization,
    });

    res.status(200).json({
      status: "success",
      message: "Organizations retrieved successfully",
      data: {
        organizations: user.Organizations,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Error fetching organizations",
      statusCode: 400,
    });
  }
};

exports.getOrganisationById = async (req, res) => {
  try {
    const organisation = await Organisation.findByPk(req.params.orgId);

    if (!organisation) {
      return res.status(404).json({
        status: "Not found",
        message: "Organisation not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Organisation retrieved successfully",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Error fetching organisation",
      statusCode: 400,
    });
  }
};

exports.createOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(422).json({
        status: "Bad request",
        message: "Name is required",
        statusCode: 422,
      });
    }

    const organization = await Organization.create({
      orgId: uuidv4(),
      name,
      description,
    });

    const user = await User.findByPk(req.user.userId);
    await user.addOrganization(organization);

    res.status(201).json({
      status: "success",
      message: "Organization created successfully",
      data: {
        orgId: organization.orgId,
        name: organization.name,
        description: organization.description,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Error creating organization",
      statusCode: 400,
    });
  }
};

exports.addUserToOrganization = async (req, res) => {
  try {
    const { userId } = req.body;
    const organization = await Organization.findByPk(req.params.orgId);

    if (!organization) {
      return res.status(404).json({
        status: "Not found",
        message: "Organization not found",
        statusCode: 404,
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: "Not found",
        message: "User not found",
        statusCode: 404,
      });
    }

    await organization.addUser(user);

    res.status(200).json({
      status: "success",
      message: "User added to organization successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Error adding user to organization",
      statusCode: 400,
    });
  }
};
