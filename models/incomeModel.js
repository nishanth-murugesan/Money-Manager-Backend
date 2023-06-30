const mongoose = require("mongoose");

const incomeModel = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Income = mongoose.model("Income", incomeModel);

module.exports = Income;
