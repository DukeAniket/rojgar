const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const User = require("../models/User");
const UserInfo = require("../models/UserInfo");
const { BadRequestError, UnauthenticatedError } = require("../errors");
//never store password as string , please hash them,miku will hate you if u dont

module.exports = {
  addService,
  editService,
  getUserService,
  getUserService,
  getService,
};
