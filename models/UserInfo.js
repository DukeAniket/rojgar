const mongoose = require("mongoose");

//mongoose docs dekhle bhai
//using regex for validation is a good idea
const UserInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "Users" },
  img: {
    type: String,
    required: [true, "bruh! image "],
  },
  bio: {
    type: String,
    minlength: 3,
    maxlength: 200,
  },
});

module.exports = mongoose.model("UserInfo", UserInfoSchema);
