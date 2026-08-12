const express = require("express");
const router = express.Router();

const { users, withdrawals, settings } = require("../database");

// Create withdrawal request
router.post("/", (req, res) => {
  const { telegramId, bkashNumber, amount } = req.body;

  if (!telegramId || !bkashNumber || amount === undefined) {
    return res.status(400).json({
      success: false,
      message: "Telegram ID, bKash number and amount are required"
    });
  }

  // Withdrawal is OFF by default
  if (!settings.withdrawalEnabled) {
    return res.status(403).json({
      success: false,
      message: "Withdrawal is currently disabled"
    });
  }

  const withdrawalAmount = Number(amount);

  if (!Number.isFinite(withdrawalAmount) || withdrawalAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid withdrawal amount"
    });
  }

  if (withdrawalAmount < settings.minimumWithdrawal) {
    return res.status(400).json({
      success: false,
      message: `Minimum withdrawal is ৳${settings.minimumWithdrawal}`
    });
  }

  const user = users.get(telegramId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  const requiredPoints =
    withdrawalAmount * settings.pointsPerTaka;

  if (user.points < requiredPoints) {
    return res.status(400).json({
      success: false,
      message: "Insufficient points"
    });
  }

  const withdrawal = {
    id: Date.now().toString(),
    telegramId,
    bkashNumber,
    amount: withdrawalAmount,
    points: requiredPoints,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  // Reserve/deduct points
  user.points -= requiredPoints;
  users.set(telegramId, user);

  withdrawals.push(withdrawal);

  res.json({
    success: true,
    message: "Withdrawal request submitted",
    withdrawal
  });
});

// Get user's withdrawal history
router.get("/:telegramId", (req, res) => {
  const userWithdrawals = withdrawals.filter(
    (item) => item.telegramId === req.params.telegramId
  );

  res.json({
    success: true,
    withdrawals: userWithdrawals
  });
});

module.exports = router;
