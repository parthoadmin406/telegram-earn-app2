const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
