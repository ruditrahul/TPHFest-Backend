const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: "String",
    },
    password: {
      type: "String",
    },
  },
  { timestamp: true }
);

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
