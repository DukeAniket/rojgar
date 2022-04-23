const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const User = require("../models/User");
const UserInfo = require("../models/UserInfo");
const Service = require("../models/Service");
const { BadRequestError, UnauthenticatedError } = require("../errors");
//never store password as string , please hash them,miku will hate you if u dont
const addService = async (req, res) => {
  req.body.userId = req.user.userId;
  console.log("adding service for user :", req.user.userId);
  Service.findOne(
    {
      $and: [{ title: req.body.title }, { userId: req.user.userId }],
    },
    async (err, doc) => {
      if (!doc || err) {
        const job = await Service.create(req.body);
        res.status(StatusCodes.CREATED).json(job);
      } else if (doc) {
        res.status(400).json({ msg: "service already listed by user" });
      }
    }
  );
};
const editService = async (req, res) => {
  // if (title === "" && discription === "") {
  //   throw new BadRequestError(
  //     "please provide new title and description of service"
  //   );
  // }
  const job = await Service.findByIdAndUpdate(
    { _id: req.body.jobId, userId: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    res.status(400).json({ msg: "couldn't remove service " });
  }
  res.status(200).json(job);
};
const deleteService = async (req, res) => {
  req.body.userId = req.user.userId;
  console.log("removing service for user :", req.user.userId);
  const job = await Service.findByIdAndRemove({
    _id: req.body.jobId,
    userId: req.user.userId,
  });
  if (!job) {
    res.status(400).json({ msg: "couldn't remove service " });
  }
  res.status(200).json(job);
};

module.exports = {
  addService,
  editService,
  getUserService,
  // getService,
  deleteService,
};
