const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/user");
const adsRoutes = require("./routes/ads");
const adsCompleteRoutes = require("./routes/adsComplete");
const adminAdsRoutes = require("./routes/adminAds");
const adminSettingsRoutes = require("./routes/adminSettings");
const withdrawalRoutes = require("./routes/withdrawal");

// Basic routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Telegram Ad Mini App API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "online"
  });
});

// API routes
app.use("/api/user", userRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/ads/complete", adsCompleteRoutes);
app.use("/api/admin/ads", adminAdsRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/withdrawal", withdrawalRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
