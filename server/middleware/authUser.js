const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = async (req, res, next) => {
  //Get token from header
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied!" });
  //Verify the token
  try {
    const decode = jwt.verify(token, config.get("jwtSecret"));
    const id = decode.user.id;
    user = await User.findById(id).select("-password");
    req.user = user;
    // req.user = decode.user.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
