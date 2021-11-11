const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let count = 10000;
const saltRounds = 10;

// All GET Requests

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  User.findById({ _id: userId })
    .then((foundUser) => {
      if (foundUser) res.status(200).json({ data: foundUser });
      else res.status(404).json({ message: "User not found" });
    })
    .catch((err) => {
      res.status(503).json({ error: err.message });
    });
};

// All POST Requests

exports.signUp = async (req, res) => {
  const {
    userName,
    userEmail,
    userPassword,
    userDOB,
    userParticipationType,
    groupSize,
    userGender,
    userPhone,
    userWhatsapp,
    userCountry,
    userCollege,
    userCollegeId,
    userReason,
  } = req.body;

  if (!userName || !userEmail || !userPassword)
    res.status(400).json({ message: "Please Enter all fields" });

  User.findOne({ userEmail: userEmail })
    .then((foundUser) => {
      if (foundUser) res.status(400).json({ message: "User Already Exists" });
      else {
        bcrypt.hash(userPassword, saltRounds, async function (err, hash) {
          if (err) res.json({ message: "Error" });
          else {
            count = count + 1;
            let uid;
            await User.find({ uid: uid }).then((foundUID) => {
              let c = count.toString();
              if (!foundUID) {
                uid = "TPH" + c;
              } else {
                count++;
                uid = "TPH" + c;
              }
            });
            const newUser = new User({
              uid,
              userName: userName,
              userEmail: userEmail,
              userPassword: hash,
              userDOB,
              userParticipationType,
              userGender,
              userPhone,
              groupSize,
              userWhatsapp,
              userCountry,
              userCollege,
              userCollegeId,
              userReason,
            });

            newUser.save().then((user) => {
              jwt.sign({ id: user.id }, process.env.SECRET, (err, token) => {
                if (err) throw err;
                res.status(200).json({
                  message: "User Sign Up Successful",
                  data: user,
                  token: token,
                });
              });
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.logIn = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  User.findOne({ userEmail: userEmail }, function (err, foundUser) {
    if (err) console.log(err);
    else {
      if (!foundUser) res.status(404).json({ message: "User not found" });
      else {
        bcrypt.compare(
          userPassword,
          foundUser.userPassword,
          function (err, result) {
            if (result == true) {
              jwt.sign(
                { id: foundUser.id },
                process.env.SECRET,
                (err, token) => {
                  if (err) throw err;
                  else {
                    res.status(200).json({
                      message: "User Log In Successful",
                      data: foundUser,
                      token: token,
                    });
                  }
                }
              );
            } else {
              res
                .status(404)
                .json({ message: "Please Enter correct credentials" });
            }
          }
        );
      }
    }
  });
};

exports.updateUserDetails = async (req, res) => {
  const userId = req.params.userId;
  const updatedData = req.body;

  User.findByIdAndUpdate({ _id: userId }, updatedData, { new: true })
    .then((updateUserDetails) => {
      if (updateUserDetails)
        res.status(200).json({
          message: "User Updated Successfully",
          data: updateUserDetails,
        });
      else res.status(404).json({ message: "User Not Found" });
    })
    .catch((err) => {
      res.status(503).json({ error: err.message });
    });
};

exports.registerEvent = async (req, res) => {
  const userId = req.params.userId;
  const eventName = req.body.eventName;

  User.findByIdAndUpdate(
    { _id: userId },
    { $push: { userParticipation: eventName } },
    { new: true }
  )
    .then((updatedUser) => {
      if (updatedUser) {
        res.status(200).json({
          message: "User Registration Successfully",
          data: updatedUser,
        });
      } else res.status(404).json({ message: "User Not Found" });
    })
    .catch((err) => {
      res.status(503).json({ error: err.message });
    });
};

exports.cancelEvent = async (req, res) => {
  const userId = req.params.userId;
  const eventName = req.body.eventName;

  User.findByIdAndUpdate(
    { _id: userId },
    { $pull: { userParticipation: eventName } },
    { new: true }
  )
    .then((updatedUser) => {
      if (updatedUser) {
        res.status(200).json({
          message: "User Registration Successfully",
          data: updatedUser,
        });
      } else res.status(404).json({ message: "User Not Found" });
    })
    .catch((err) => {
      res.status(503).json({ error: err.message });
    });
};
