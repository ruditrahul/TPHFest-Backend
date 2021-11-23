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
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8000;

var instance = new razorpay({
  key_id: "rzp_live_FlEgz7lscE95xL",
  key_secret: "CBNHfPfOkNHsjxQK5h80wP4N",
});




app.get("/payment", (req, res) => {
  res.status(200).json("Hello ji");
});

app.get("/payment/order/:Amount", (req, res) => {
  const { Amount } = req.params;

  console.log(Amount);

  const amount = Amount * 100 + (Amount / 100) * 2 * 100;
  const currency = "INR";
  const recipt = "TPH#1";
  const notes = { desc: "Inclusive of all taxes" };

  instance.orders.create({ amount, currency, notes }, (err, order) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.status(200).json(order);
  });
});

app.post("/verify/razorpay-signature", (req, res) => {
  console.log(JSON.stringify(req.body));
 
  const orderId = req.body.payload.payment.entity.order_id;
  const paymentId = req.body.payload.payment.entity.id;


  const crypto = require("crypto");
  const hash = crypto
    .createHmac("SHA256", "iloveOTTFest987")
    .update(JSON.stringify(req.body))
    .digest("hex");
  console.log("\n\n");
  // console.log(hash);
  // console.log(req.headers["x-razorpay-signature"]);

  if (hash == req.headers["x-razorpay-signature"]) {
    console.log("Save credentials for future referece");
  } else {
    console.log("Decline payment");
  }
  res.status(200);
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} is up and running`);
});
