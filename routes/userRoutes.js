const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const UserController = require("../controllers/user");

router.get(
  "/get-user-by-id/:userId",
  auth,
  UserController.getUserById,
  (err) => {
    console.log("Error in getting user by ID");
  }
);

router.post("/sign-up", UserController.signUp, (err) => {
  console.log("Error in sign up");
});

router.post("/log-in", UserController.logIn, (err) => {
  console.log("Error in log in");
});

router.post(
  "/update-user-details/:userId",
  auth,
  UserController.updateUserDetails,
  (err) => {
    console.log("Error in update user details");
  }
);

router.post(
  "/register-event/:userId",
  auth,
  UserController.registerEvent,
  (err) => {
    console.log("Error in register event");
  }
);

router.post(
  "/cancel-event/:userId",
  auth,
  UserController.cancelEvent,
  (err) => {
    console.log("Error in register event");
  }
);

module.exports = router;
