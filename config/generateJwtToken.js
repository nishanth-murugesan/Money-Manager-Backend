const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "harish", { expiresIn: "1d" });
};

module.exports = generateToken;
