const express = require("express");
const router = express.Router();

const { users } = require("../database");

// Get user dashboard data
router.get("/:telegramId", (req, res) => {
  const { telegramId } = req.params;

  let user = users.get(telegramId);

  if (!user) {
    user = {
      telegramId,
      points: 0,
      completedAds: 0,
      lastAdId: null,
      createdAt: new Date().toISOString()
    };

    users.set(telegramId, user);
  }

  const balance = user.points / 3.2;

  res.json({
    success: true,
    user: {
      telegramId: user.telegramId,
      points: user.points,
      completedAds: user.completedAds,
      balance: Number(balance.toFixed(2))
    }
  });
});

module.exports = router;
