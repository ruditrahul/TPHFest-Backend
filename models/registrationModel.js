const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    participationType: {
      type: String,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    eventName: {
      type: String,
    },
    eventType: {
      type: String,
    },
    paymentStatus: {
      type: boolean,
      default: false,
    },
  },
  { timestamp: true }
);

const Registration = mongoose.model("Registration", RegistrationSchema);

module.exports = Registration;
