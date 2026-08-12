const express = require("express");
const router = express.Router();

const { settings } = require("../database");

// Get settings
router.get("/", (req, res) => {
  res.json({
    success: true,
    settings: {
      withdrawalEnabled: settings.withdrawalEnabled,
      minimumWithdrawal: settings.minimumWithdrawal,
      pointsPerTaka: settings.pointsPerTaka,
      completionTime: settings.completionTime
    }
  });
});

// Update settings
router.post("/", (req, res) => {
  const {
    withdrawalEnabled,
    minimumWithdrawal,
    pointsPerTaka,
    completionTime
  } = req.body;

  if (withdrawalEnabled !== undefined) {
    settings.withdrawalEnabled = Boolean(withdrawalEnabled);
  }

  if (minimumWithdrawal !== undefined) {
    const amount = Number(minimumWithdrawal);

    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid minimum withdrawal amount"
      });
    }

    settings.minimumWithdrawal = amount;
  }

  if (pointsPerTaka !== undefined) {
    const value = Number(pointsPerTaka);

    if (!Number.isFinite(value) || value <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid points conversion"
      });
    }

    settings.pointsPerTaka = value;
  }

  if (completionTime !== undefined) {
    const value = Number(completionTime);

    if (!Number.isFinite(value) || value < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid completion time"
      });
    }

    settings.completionTime = value;
  }

  res.json({
    success: true,
    message: "Settings updated successfully",
    settings
  });
});

module.exports = router;
