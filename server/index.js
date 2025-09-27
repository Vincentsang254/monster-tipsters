const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors")

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tipsRoutes = require ("./routes/tipsRoutes");
const jackpotRoutes = require ("./routes/jackpotRoutes");
const paymentRoutes = require ("./routes/paymentRoutes");
const imageRoutes = require ("./routes/imageRoutes");

dotenv.config();
const app = express();
const port = 3001;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://monster-tipster.onrender.com", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  })
);

const db = require("./models");
// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tips", tipsRoutes);
app.use("/api/jackpots", jackpotRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/images", imageRoutes);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
  }

db.sequelize.sync().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
