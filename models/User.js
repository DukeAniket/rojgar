const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { string } = require("joi");
//mongoose docs dekhle bhai
//using regex for validation is a good idea
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    minlength: 3,
    maxlength: 70,
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide valid email",
    ],
    unique: true, //everyone does this, dont blame me
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 6,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: "fuck me",
  },
  passwordToken: {
    type: String,
    default: "",
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
  friends: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
UserSchema.methods.createJWT = function () {
  //with function we can use this keyword
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};
// we used bcryptjs for hashing password then we used jwt for token
module.exports = mongoose.model("User", UserSchema);
//there are setup where front end decodes the token itself so we dont store secret stuff in jwt
// one way i know is storing it in local storage
