const Expense = require("../models/Expense");

// =======================
// Create Expense
// =======================
const createExpense = async (req, res) => {
  try {
    const { farm, crop, category, description, amount, date, paymentMethod, notes } = req.body;

    if (!description || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Description and amount are required.",
      });
    }

    const expense = await Expense.create({
      farmer: req.user.id,
      farm: farm || null,
      crop: crop || null,
      category: category || "Other",
      description,
      amount: Number(amount),
      date: date || new Date(),
      paymentMethod: paymentMethod || "Cash",
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    console.error("Create Expense Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =======================
// Get Filtered Expenses
// =======================
const getExpenses = async (req, res) => {
  try {
    const { farm, crop, category, startDate, endDate } = req.query;

    const query = { farmer: req.user.id };

    if (farm) query.farm = farm;
    if (crop) query.crop = crop;
    if (category) query.category = category;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .populate("farm", "farmName")
      .populate("crop", "cropName")
      .sort({ date: -1 });

    // Summary calculations
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthExpenses = expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    // Highest category
    const catTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    let highestCategory = "None";
    let maxCatAmount = 0;
    Object.entries(catTotals).forEach(([cat, amt]) => {
      if (amt > maxCatAmount) {
        maxCatAmount = amt;
        highestCategory = cat;
      }
    });

    res.status(200).json({
      success: true,
      count: expenses.length,
      totalExpenses,
      thisMonthExpenses,
      highestCategory,
      expenses,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =======================
// Get Single Expense by ID
// =======================
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    })
      .populate("farm", "farmName")
      .populate("crop", "cropName");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense record not found",
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error("Get Expense By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =======================
// Update Expense
// =======================
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense record not found",
      });
    }

    const { farm, crop, category, description, amount, date, paymentMethod, notes } = req.body;

    if (farm !== undefined) expense.farm = farm || null;
    if (crop !== undefined) expense.crop = crop || null;
    if (category !== undefined) expense.category = category;
    if (description !== undefined) expense.description = description;
    if (amount !== undefined) expense.amount = Number(amount);
    if (date !== undefined) expense.date = date;
    if (paymentMethod !== undefined) expense.paymentMethod = paymentMethod;
    if (notes !== undefined) expense.notes = notes;

    const updatedExpense = await expense.save();

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =======================
// Delete Expense
// =======================
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
