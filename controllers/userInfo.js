const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const User = require("../models/User");
const UserInfo = require("../models/UserInfo");
const { BadRequestError, UnauthenticatedError } = require("../errors");
//never store password as string , please hash them,miku will hate you if u dont
const createInfo = async (req, res) => {
  const prev = await UserInfo.findOne({ userId: req.user.userId });
  if (!prev) {
    const origin = process.env.ORIGIN;
    const info = await UserInfo.create({
      ...req.body,
      img: `${origin}/wallpaperflare.com_wallpaper.jpg`,
    });
    res.status(StatusCodes.OK).json(info);
  } else {
    prev.bio = req.body.bio;
    prev.save();
    res.status(StatusCodes.OK).json(prev);
  }
};
const getInfo = async (req, res) => {
  const info = await UserInfo.findOne({ userId: req.params.id });
  if (!info) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "user info unavailable" });
  } else res.status(StatusCodes.OK).json(info);
};
module.exports = {
  createInfo,
  getInfo,
};
