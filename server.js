require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const postRoute = require("./routes/post");
const authRoute = require("./routes/auth");

// intializing app
const app = express();
const PORT = process.env.PORT || 5000;

// connect database
connectDB();

// middlewares
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// routes
app.use("/post", postRoute);
app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// starting server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
