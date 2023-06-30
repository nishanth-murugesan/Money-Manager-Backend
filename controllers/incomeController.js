const Income = require("../models/incomeModel");

const createNewIncome = async (req, res) => {
  let { description, category, amount, date } = req.body;

  if (!description || !category || !amount || !date) {
    return res.status(400).json({ message: "Required input missing" });
  }

  let [year, month, day] = date.split("-").map(Number);
  --month;

  let currentDate = new Date();
  let expenseDate = new Date(year, month, day);

  if (currentDate.getTime() < expenseDate.getTime()) {
    return res
      .status(400)
      .json({ message: "Expense date cannot be greater than today" });
  }

  try {
    let income = await Income.create({
      user: req.user,
      description,
      category,
      amount,
      date: expenseDate.toISOString(),
    });

    res.status(200).json(income);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const getIncome = async (req, res) => {
  let type = req.params.type;

  if (!type) {
    return res.status(400).json({ message: "Required input missing" });
  }

  if (type != "all" && type != "week" && type != "month" && type != "year") {
    return res.status(400).json({ message: "Invalid type value" });
  }

  try {
    let income = await Income.find({ user: req.user }).sort({ date: -1 });
    let filteredincome = [];
    if (type === "all") {
      return res.status(200).json(income);
    }

    let dateTocompare;
    let currentDate = new Date();
    if (type === "week") {
      dateTocompare = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateTocompare = dateTocompare.getTime();
    }
    if (type === "month") {
      let day = currentDate.getDate();
      let month = currentDate.getMonth();
      let year = currentDate.getFullYear();

      if (month === 0) {
        year = year - 1;
      } else {
        month = month - 1;
      }

      console.log(year, month, day);

      dateTocompare = new Date(year, month, day);
      dateTocompare = dateTocompare.getTime();
    }
    if (type === "year") {
      let day = currentDate.getDate();
      let month = currentDate.getMonth();
      let year = currentDate.getFullYear();

      --year;
      dateTocompare = new Date(year, month, day);
      dateTocompare = dateTocompare.getTime();
    }

    filteredincome = income.filter((e) => {
      let exp_date = new Date(e.date);
      exp_date = exp_date.getTime();
      if (exp_date >= dateTocompare) {
        return true;
      } else {
        return false;
      }
    });

    res.status(200).json(filteredincome);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const getIncomeDateBased = async (req, res) => {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Required input missing" });
  }

  let [year1, month1, day1] = startDate.split("-").map(Number);
  --month1;

  let d1 = new Date(year1, month1, day1);

  let [year2, month2, day2] = endDate.split("-").map(Number);
  --month2;

  let d2 = new Date(year2, month2, day2);

  d1 = d1.getTime();
  d2 = d2.getTime();

  if (d1 > d2) {
    return res
      .status(400)
      .json({ message: "Start date should be less than end date" });
  }

  try {
    let income = await Income.find({ user: req.user }).sort({ date: -1 });
    let filteredincome = [];

    filteredincome = income.filter((e) => {
      let exp_date = new Date(e.date);
      exp_date = exp_date.getTime();
      if (exp_date >= d1 && exp_date <= d2) {
        return true;
      } else {
        return false;
      }
    });

    res.status(200).json(filteredincome);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const deleteIncome = async (req, res) => {
  expId = req.params.id;
  try {
    await Income.deleteOne({ _id: expId });
    res.status(200).json({ message: "Income deleted" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createNewIncome,
  getIncome,
  getIncomeDateBased,
  deleteIncome,
};
