const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const helperRoutes = require("./routes/helperRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/helper", helperRoutes);

app.get("/", (req, res) => {
  res.send("Emergency Help API Running");
});

module.exports = app;