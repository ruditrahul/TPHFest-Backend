const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
  },
  userName: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  userPassword: {
    type: String,
  },
  userDOB: {
    type: String,
  },
  userGender: {
    type: String,
  },
  userPhone: {
    type: String,
  },
  userWhatsapp: {
    type: String,
  },
  userCountry: {
    type: String,
  },
  userCollege: {
    type: String,
  },
  userParticipationType: {
    type: String,
    enum: ["GROUP", "INDIVIDUAL"],
  },
  groupSize: {
    type: Number,
    default: 0,
  },
  userParticipation: [
    {
      type: String,
    },
  ],
  userCollegeId: {
    type: String,
  },
  userReason: {
    type: String,
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
