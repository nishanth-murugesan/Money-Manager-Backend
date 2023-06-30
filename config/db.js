const mongoose = require("mongoose");

let DB_URL =
  "mongodb+srv://nishanthnicky819:rLBVuXdpNoHsrPNX@cluster0.dnspqls.mongodb.net/moneyTracker";

const connectToBb = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo db connected");
  } catch (err) {
    console.log("Mongo db connection failed");
  }
};

module.exports = connectToBb;
