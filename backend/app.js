const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { connectDB } = require("./src/config/database");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

const authRouter = require("./src/routes/authRouter");
const profileRouter = require("./src/routes/profileRouter");
const connectionRouter = require("./src/routes/connection");
const userRouter = require("./src/routes/userRouter");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
