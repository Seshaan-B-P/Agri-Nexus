const Farm = require("../models/Farm");
const Crop = require("../models/Crop");
const DiseaseHistory = require("../models/DiseaseHistory");
const Task = require("../models/Task");
const Marketplace = require("../models/Marketplace");
const Expense = require("../models/Expense");

// =======================
// Get Report Analytics
// =======================
const getReportAnalytics = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // 1. Farms Analytics
    const farms = await Farm.find({ farmer: farmerId });
    const totalFarms = farms.length;
    const totalFarmArea = farms.reduce((sum, f) => {
      const areaInAcres = f.areaUnit === "Hectares" ? f.area * 2.47105 : f.area;
      return sum + (areaInAcres || 0);
    }, 0);

    const soilTypesCount = farms.reduce((acc, f) => {
      const s = f.soilType || "Unspecified";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    // 2. Crops Analytics
    const crops = await Crop.find({ farmer: farmerId });
    const totalCrops = crops.length;

    const cropsBySeason = crops.reduce((acc, c) => {
      const s = c.season || "Other";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    const cropsByStatus = crops.reduce((acc, c) => {
      const st = c.status || "Planted";
      acc[st] = (acc[st] || 0) + 1;
      return acc;
    }, {});

    const cropsByType = crops.reduce((acc, c) => {
      const name = c.cropName || "Unknown";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    // 3. Disease Analytics
    const scans = await DiseaseHistory.find({ farmer: farmerId });
    const totalScans = scans.length;

    const diseaseFrequency = scans.reduce((acc, s) => {
      const d = s.disease || "Healthy / Unknown";
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});

    const severityDistribution = scans.reduce(
      (acc, s) => {
        const sev = s.severity || "Low";
        acc[sev] = (acc[sev] || 0) + 1;
        return acc;
      },
      { High: 0, Medium: 0, Low: 0 }
    );

    const topDiseases = Object.entries(diseaseFrequency)
      .map(([disease, count]) => ({ disease, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 4. Task Analytics
    const tasks = await Task.find({ farmer: farmerId });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    const pendingTasks = tasks.filter((t) => t.status === "Pending").length;

    const taskTypeDistribution = tasks.reduce((acc, t) => {
      const type = t.taskType || "General";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // 5. Marketplace Analytics
    const listings = await Marketplace.find({ farmer: farmerId });
    const totalListings = listings.length;
    const activeListings = listings.filter((l) => l.status === "Available").length;
    const soldListings = listings.filter((l) => l.status === "Sold").length;
    const reservedListings = listings.filter((l) => l.status === "Reserved").length;

    // 6. Real Expense Analytics (MongoDB Aggregations)
    const expenses = await Expense.find({ farmer: farmerId }).populate("farm", "farmName");
    const hasExpenses = expenses.length > 0;

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

    const expensesByCategory = expenses.reduce((acc, e) => {
      const cat = e.category || "Other";
      acc[cat] = (acc[cat] || 0) + e.amount;
      return acc;
    }, {});

    const expensesByFarm = expenses.reduce((acc, e) => {
      const farmName = e.farm?.farmName || "General Farm";
      acc[farmName] = (acc[farmName] || 0) + e.amount;
      return acc;
    }, {});

    // Monthly breakdown (last 6 months)
    const monthlyExpenses = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = d.toLocaleDateString("en-IN", { month: "short" });
      monthlyExpenses[mName] = 0;
    }
    expenses.forEach((e) => {
      const d = new Date(e.date);
      const mName = d.toLocaleDateString("en-IN", { month: "short" });
      if (monthlyExpenses[mName] !== undefined) {
        monthlyExpenses[mName] += e.amount;
      }
    });

    res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: {
        farmSummary: {
          totalFarms,
          totalFarmArea: Number(totalFarmArea.toFixed(2)),
          soilTypesCount,
        },
        cropSummary: {
          totalCrops,
          cropsBySeason,
          cropsByStatus,
          cropsByType,
        },
        diseaseAnalytics: {
          totalScans,
          topDiseases,
          severityDistribution,
        },
        taskAnalytics: {
          totalTasks,
          completedTasks,
          pendingTasks,
          taskTypeDistribution,
        },
        marketplaceAnalytics: {
          totalListings,
          activeListings,
          soldListings,
          reservedListings,
        },
        expenseAnalytics: {
          hasExpenses,
          totalExpenses,
          thisMonthExpenses,
          expensesByCategory,
          expensesByFarm,
          monthlyExpenses,
          message: hasExpenses ? "Expense analytics compiled" : "No expense data available.",
        },
      },
    });
  } catch (error) {
    console.error("Report Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load report analytics",
    });
  }
};

module.exports = {
  getReportAnalytics,
};
