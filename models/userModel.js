const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
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
    userReason: {
      type: String,
    },
    userRefferalToken: {
      type: String,
    },
    userPayment: {
      type: Number,
      default: 0,
    },
    userGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    userRegistrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Registration",
      },
    ],
  },
  { timestamp: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
