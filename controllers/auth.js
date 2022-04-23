const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const crypto = require("crypto");
const { sendVerificationEmail, sendResetPasswordEmail } = require("./utils");
//never store password as string , please hash them,miku will hate you if u dont

const register = async (req, res) => {
  const { name, email, password } = req.body;
  //https://www.npmjs.com/package/bcrypt
  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new BadRequestError("Email Already Exist");
  }
  const verificationToken = crypto.randomBytes(69).toString("hex");
  const user = await User.create({ name, email, password, verificationToken });

  const origin = process.env.ORIGIN;
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  res
    .status(StatusCodes.ACCEPTED)
    .json({ msg: "Miku wants to verify your Email", verificationToken, email });
  //send verificationToken only during dev
  //   res.status(StatusCodes.CREATED).json({
  //     msg: "Success! Miku wants to verify your email",
  //     verificationToken,
  //     email,
  //   });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.params;
  const user = await User.findOne({ email });
  if (!user || user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Verification Error");
  }
  user.isVerified = true;
  user.verificationToken = "";
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Password didnt match");
  }
  if (!user.isVerified) {
    const verificationToken = crypto.randomBytes(69).toString("hex");
    user.verificationToken = verificationToken;
    user.save();
    const origin = process.env.ORIGIN;
    await sendVerificationEmail({
      name: user.name,
      email: user.email,
      verificationToken: user.verificationToken,
      origin,
    });
    res.status(StatusCodes.ACCEPTED).json({
      msg: "Miku wants to verify your Email",
      verificationToken,
      email,
    });
    throw new UnauthenticatedError(
      "Please Verify your Email, Miku is waiting for you!!!"
    );
  }
  const token = user.createJWT();
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expire: new Date(Date.now() + oneDay * 5),
    signed: true,
  });

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 5000),
  });
  res.status(201).json({ msg: "user logout successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const origin = process.env.WEB_ORIGIN;
  const user = await User.findOne({ email });
  if (!user || !email) {
    throw new UnauthenticatedError("Please provide valid Email or Register");
  }
  const passwordToken = crypto.randomBytes(69).toString("hex");
  await sendResetPasswordEmail({
    name: user.name,
    email: user.email,
    token: passwordToken,
    origin,
  });
  const passwordTokenExpirationDate = new Date(Date.now() + 1000 * 600);
  user.passwordToken = passwordToken;
  user.passwordTokenExpirationDate = passwordTokenExpirationDate;
  await user.save();
  res.json({ msg: `reset password link send to ${email}` });
};
const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password)
    throw new BadRequestError("please provide correct values");
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError("Sorry Cant find User");
  const currentTime = new Date();
  if (
    user.passwordToken === token &&
    user.passwordTokenExpirationDate > currentTime
  ) {
    user.password = password;
    user.passwordToken = null;
    user.passwordTokenExpirationDate = null;
    await user.save();
    res
      .status(StatusCodes.ACCEPTED)
      .json({ msg: "password reset successful, please login!" });
  } else res.status(StatusCodes.NOT_MODIFIED).json({ msg: "please try again" });
};
module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
