const User = require("../models/userModel");
const Registration = require("../models/registrationModel");
const Group = require("../models/groupModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let count = 10000;
const saltRounds = 10;

// All GET Requests

exports.getUserById = async (req, res) => {
  const userId = req.user.id;

  User.findById({ _id: userId })
    .populate({ path: "userGroups", populate: "groupAdmin groupMembers" })
    .populate({ path: "userRegistrations", populate: "groupId" })
    .then((foundUser) => {
      if (foundUser) res.status(200).json({ data: foundUser });
      else res.status(404).json({ message: "User not found" });
    })
    .catch((err) => {
      res.status(503).json({ error: err.message });
    });
};

exports.getAllUsers = (req, res) => {
  User.find({})
    .then((foundUser) => {
      res.status(202).json({ data: foundUser });
    })
    .catch((err) => {
      res.status(503).json({ message: err.message });
    });
};

exports.getAllRegistrations = (req, res) => {
  Registration.find({})
    .populate("userId", "userName userPhone uid")
    .then((foundRegistration) => {
      res.status(202).json({ data: foundRegistration });
    })
    .catch((err) => {
      res.status(503).json({ message: err.message });
    });
};

exports.getAllGroups = (req, res) => {
  Group.find({})
    .populate("groupAdmin", "userName userPhone uid")
    .popualate("groupMembers")
    .populate("groupRegistrations")
    .then((foundRegistration) => {
      res.status(202).json({ data: foundRegistration });
    })
    .catch((err) => {
      res.status(503).json({ message: err.message });
    });
};

// All POST Requests

exports.signUp = async (req, res) => {
  const {
    userName,
    userEmail,
    userPassword,
    userDOB,
    userGender,
    userPhone,
    userWhatsapp,
    userCountry,
    userCollege,
    userReason,
    userRefferalToken,
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
            // count = count + 1;
            // let uid;
            // await User.find({ uid: uid }).then((foundUID) => {
            //   let c = count.toString();
            //   if (!foundUID) {
            //     uid = "TPH" + c;
            //   } else {
            //     count++;
            //     uid = "TPH" + c;
            //   }
            // });

            const lastUser = await User.find({}).sort({ _id: -1 }).limit(1);
            console.log(lastUser[0]);
            if (!lastUser[0]) {
              count = count + 1;
              uid = "TPH" + count.toString();
            } else {
              lastUserUID = lastUser[0].uid;
              // console.log(lastUser);
              // console.log(
              //   "TPH" + (parseInt(lastUser.uid.substring(3, 8)) + 1).toString()
              // );

              uid =
                "TPH" +
                (parseInt(lastUser[0].uid.substring(3, 8)) + 1).toString();
            }

            console.log(uid);
            const newUser = new User({
              uid,
              userName: userName,
              userEmail: userEmail,
              userPassword: hash,
              userDOB,
              userGender,
              userPhone,
              userWhatsapp,
              userCountry,
              userCollege,
              userReason,
              userRefferalToken,
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
                .status(400)
                .json({ message: "Please Enter correct credentials" });
            }
          }
        );
      }
    }
  });
};

exports.updateUserDetails = async (req, res) => {
  const userId = req.user.id;
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

exports.createGroup = async (req, res) => {
  const userId = req.user.id;
  const groupName = req.body.groupName;
  const groupMembers = req.body.groupMembers;

  const groupMemberIds = [];
  for (const memberId of groupMembers) {
    await User.findOne({ uid: memberId }).then((foundUser) => {
      groupMemberIds.push(foundUser.id);
    });
  }

  const newGroup = new Group({
    groupAdmin: userId,
    groupName,
    groupMembers: groupMemberIds,
  });

  newGroup
    .save()
    .then(async (newGroup) => {
      if (newGroup) {
        for (const memberId of groupMemberIds) {
          await User.findByIdAndUpdate(
            { _id: memberId },
            { $push: { userGroups: newGroup.id } }
          ).then((updatedUser) => {
            console.log(updatedUser);
          });
        }

        res
          .status(200)
          .json({ message: "Group Created Successfully", data: newGroup });
      } else res.status(404).json({ message: "Error in creating group" });
    })
    .catch((err) => {
      res.status(503).json({ error: err.message });
    });
};

exports.registerEvent = async (req, res) => {
  const userId = req.user.id;
  const eventName = req.body.eventName;
  const participationType = req.body.participationType;
  const groupId = req.body.groupId;
  const eventType = req.body.eventType;

  console.log(userId);

  if (groupId) {
    await Registration.findOne({ groupId: groupId, eventName: eventName })
      .then((foundRegistration) => {
        if (foundRegistration)
          res.status(400).json({ message: "Already Registered" });
        else {
          const newRegistration = new Registration({
            userId,
            eventName,
            participationType,
            groupId,
            eventType,
          });

          newRegistration
            .save()
            .then(async (newRegistration) => {
              const registrationId = newRegistration.id;
              await Group.findByIdAndUpdate(
                { _id: groupId },
                { $push: { groupRegistrations: registrationId } },
                { new: true }
              ).then(async (updatedGroup) => {
                console.log(updatedGroup);
                const groupMembersId = updatedGroup.groupMembers;
                for (const memberId of groupMembersId) {
                  await User.findByIdAndUpdate(
                    { _id: memberId },
                    { $push: { userRegistrations: registrationId } },
                    { new: true }
                  ).then((updatedUser) => {
                    console.log(updatedUser);
                  });
                }
              });

              res.status(200).json({
                message: "Group Regsitration Successfully Done",
                data: newRegistration,
              });
            })
            .catch((err) => {
              res.status(503).json({ error: err.message });
            });
        }
      })
      .catch((err) => {
        res.status(503).json({ error: err.message });
      });
  } else {
    await Registration.findOne({ userId: userId, eventName: eventName }).then(
      (foundRegistration) => {
        if (foundRegistration)
          res.status(400).json({ message: "Already Registered" });
        else {
          const newRegistration = new Registration({
            userId,
            eventName,
            participationType,
            eventType,
          });
          newRegistration
            .save()
            .then(async (newRegistration) => {
              const registrationId = newRegistration.id;

              await User.findByIdAndUpdate(
                { _id: userId },
                { $push: { userRegistrations: registrationId } },
                { new: true }
              ).then((updatedUser) => {
                console.log(updatedUser);
              });

              res.status(200).json({
                message: "Individual Regsitration Successfully Done",
                data: newRegistration,
              });
            })
            .catch((err) => {
              res.status(503).json({ error: err.message });
            });
        }
      }
    );
  }
};

exports.updateEvents = async (req, res) => {
  const registrationId = req.params.registrationId;
  await Registration.findByIdAndUpdate({ _id: registrationId }, req.body, {
    new: true,
  })
    .then((updatedRegistration) => {
      if (updatedRegistration) {
        res.status(200).json({ data: updatedRegistration });
      } else res.status(404).json({ data: "Error" });
    })
    .catch((err) => {
      res.status(503).json({ error: err.message });
    });
};

exports.cancelEvent = async (req, res) => {
  const userId = req.user.id;
  const eventId = req.body.eventId;

  await Registration.findById({ _id: eventId }).then(
    async (foundRegistration) => {
      if (foundRegistration.groupId) {
        await Group.findById({ _id: foundRegistration.groupId }).then(
          async (foundGroup) => {
            if (foundGroup.groupMembers.length !== 0) {
              for (const userId of foundGroup.groupMembers) {
                await User.findByIdAndUpdate(
                  { _id: userId },
                  { $pull: { userRegistrations: eventId } }
                ).then((updatedUser) => {
                  console.log("User Updated Successfully");
                });
              }
            }
          }
        );
        await Group.findByIdAndUpdate(
          { _id: foundRegistration.groupId },
          { $pull: { groupRegistrations: eventId } }
        ).then((updatedGroup) => {
          console.log("Group Updated Successfully");
        });

        res.status(202).json({ message: "Successfully deleted registration" });
      } else {
        await User.findByIdAndUpdate(
          { _id: userId },
          { $pull: { userRegistrations: eventId } }
        )
          .then((updatedUser) => {
            Registration.findByIdAndDelete({ _id: eventId })
              .then((deletedRegistration) => {
                if (deletedRegistration)
                  res.status(202).json({
                    message: "Event Registration deleted successfully",
                  });
              })
              .catch((err) => {
                res.status(503).json({ error: err.message });
              });
          })
          .catch((err) => {
            res.status(503).json({ error: err.message });
          });
      }
    }
  );
};
