const express = require("express");
const router = express.Router();

const { ads } = require("../database");

// Add a new ad
router.post("/", (req, res) => {
  const { title, url } = req.body;

  if (!title || !url) {
    return res.status(400).json({
      success: false,
      message: "Title and URL are required"
    });
  }

  const newAd = {
    id: Date.now().toString(),
    title,
    url,
    createdAt: new Date().toISOString()
  };

  ads.push(newAd);

  res.json({
    success: true,
    message: "Ad added successfully",
    ad: newAd
  });
});

// Get all ads
router.get("/", (req, res) => {
  res.json({
    success: true,
    ads
  });
});

// Delete an ad
router.delete("/:id", (req, res) => {
  const index = ads.findIndex((ad) => ad.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Ad not found"
    });
  }

  const deletedAd = ads.splice(index, 1)[0];

  res.json({
    success: true,
    message: "Ad deleted successfully",
    ad: deletedAd
  });
});

module.exports = router;
