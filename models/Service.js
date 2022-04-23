const mongoose = require("mongoose");
//mongoose docs dekhle bhai
//using regex for validation is a good idea
const ServiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "Service" },
  state: {
    type: String,
    required: [true, "please specify state"],
  },
  city: {
    type: String,
    required: [true, "please specify city"],
  },
  contact: {
    type: String,
    required: [true, "please specify contact no"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    required: [true, "please specify contact no"],
  },
  discription: {
    type: String,
  },
});

// we used bcryptjs for hashing password then we used jwt for token
module.exports = mongoose.model("Service", ServiceSchema);
//there are setup where front end decodes the token itself so we dont store secret stuff in jwt
// one way i know is storing it in local storage
