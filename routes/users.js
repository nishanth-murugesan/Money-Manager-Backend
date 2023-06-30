var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const generateToken = require("../config/generateJwtToken");

// to register user
// route = /users/register

router.post("/register", async (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Required input missing" });
  }

  try {
    let emailExists = await User.find({ email: email });

    if (emailExists.length > 0) {
      return res.status(400).json({ message: "Email allready exists" });
    }

    password = await bcrypt.hash(password, 10);

    let user = await User.create({
      name,
      email,
      password,
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

// to signin
// route = api/users/sigin

router.post("/signin", async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Required input missing" });
  }

  try {
    let user = await User.findOne({ email: email });

    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
    }
    if (password && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
