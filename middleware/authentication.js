const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  //checking the header
  // const token = req.signedCookies.token;
  // console.log(token);
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("Authentication Error");
    throw new UnauthenticatedError("Authentication Error");
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //adding user to anime list routes
    //we can add remove user functionality too
    // const user=User.findById(payload.userId).select('-password')
    req.user = { ...payload };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Error");
  }
  //we need to fuckin imp to invoke next or we wont reach anime routes anyway
};

module.exports = auth;
