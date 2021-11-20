require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const razorpay = require("razorpay");

const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1/user", userRoutes);

var instance = new razorpay({
  key_id: "rzp_test_DC9Y7TPOChYcuP",
  key_secret: "RvdcKmFgkplVjxWqmMldMYCV",
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8000;

app.get("/payment", (req, res) => {
  res.status(200).json("Hello ji");
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} is up and running`);
});
