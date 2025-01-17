const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./src/config/database");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], // Include PATCH
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Cache-Control", "no-store"); // Prevent caching
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

const authRouter = require("./src/routes/authRouter");
const profileRouter = require("./src/routes/profileRouter");
const connectionRouter = require("./src/routes/connection");
const userRouter = require("./src/routes/userRouter");
const { paymentRouter } = require("./src/routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

connectDB();
