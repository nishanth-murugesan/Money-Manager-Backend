const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyUser = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      let token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, "harish");

      let user = await User.findById(decoded.id);
      if (user) {
        req.user = user._id;
        next();
      } else {
        res
          .status(401)
          .json({ message: "Authorizarion is failed or token failed" });
      }
    } catch (err) {
      res
        .status(401)
        .json({ message: "Authorizarion is failed or token failed" });
    }
  } else {
    res.status(401).json({ message: "user is not authorised" });
  }
};

module.exports = verifyUser;
