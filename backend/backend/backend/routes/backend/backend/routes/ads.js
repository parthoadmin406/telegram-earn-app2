const express = require("express");
const router = express.Router();

const { ads, users } = require("../database");

// Get next ad for a user
router.get("/next/:telegramId", (req, res) => {
  const { telegramId } = req.params;

  if (ads.length === 0) {
    return res.json({
      success: false,
      message: "No ads available"
    });
  }

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

  // Find an ad that is not the same as the last completed ad
  let nextAd = ads.find((ad) => ad.id !== user.lastAdId);

  // If only one ad exists, allow it
  if (!nextAd) {
    nextAd = ads[0];
  }

  res.json({
    success: true,
    ad: {
      id: nextAd.id,
      url: nextAd.url,
      title: nextAd.title
    }
  });
});

module.exports = router;
