const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupName: {
      type: String,
    },
    groupMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupRegistrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Registration",
      },
    ],
  },
  { timestamp: true }
);

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
