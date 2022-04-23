const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const UserInfo = require("../models/UserInfo");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
//never store password as string , please hash them,miku will hate you if u dont
const uploadImgLocal = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("pls provide image file");
  }
  let userImg = req.files.image;
  if (!userImg.mimetype.startsWith("image")) {
    throw new BadRequestError("not an image file!!");
  }
  if (userImg.size > 1024 * 1024) {
    throw new BadRequestError("pls upload smaller than 1Mb");
  }
  const imgPath = path.join(
    __dirname,
    "../public/uploads/" + `${userImg.name}`
  );
  await userImg.mv(imgPath);
  return res.status(StatusCodes.OK).json({ img: `/uploads/${userImg.name}` });
};

const uploadImg = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "alistUser",
    }
  );
  try {
    const info = await UserInfo.findOne({ userId: req.user.userId });
    info.img = result.url;
    info.save();
    fs.unlinkSync(req.files.image.tempFilePath);
    res.status(StatusCodes.OK).json(result.url);
  } catch (err) {
    res.status(StatusCodes.NOT_MODIFIED).json({ msg: "please try again" });
  }
};

module.exports = {
  uploadImg,
};
