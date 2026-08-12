const express = require("express");
const router = express.Router();

const { ads, users, settings } = require("../database");

router.post("/", (req, res) => {
  const { telegramId, adId, startedAt } = req.body;

  if (!telegramId || !adId || !startedAt) {
    return res.status(400).json({
      success: false,
      message: "Missing required data"
    });
  }

  const user = users.get(telegramId);
  const ad = ads.find((item) => item.id === adId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  if (!ad) {
    return res.status(404).json({
      success: false,
      message: "Ad not found"
    });
  }

  const elapsedSeconds =
    (Date.now() - Number(startedAt)) / 1000;

  if (elapsedSeconds < settings.completionTime) {
    return res.status(400).json({
      success: false,
      message: "Ad was not watched for 7 seconds"
    });
  }

  if (user.lastAdId === adId) {
    return res.status(400).json({
      success: false,
      message: "The same ad cannot be completed consecutively"
    });
  }

  user.points += 1;
  user.completedAds += 1;
  user.lastAdId = adId;

  users.set(telegramId, user);

  res.json({
    success: true,
    message: "Ad completed successfully",
    pointsAdded: 1,
    totalPoints: user.points,
    balance: Number((user.points / settings.pointsPerTaka).toFixed(2))
  });
});

module.exports = router;
