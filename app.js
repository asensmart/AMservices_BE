require("dotenv").config();
const ConnectMongoDB = require("./config/mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const Router = require("./routers/index.js");
const cookieParser = require("cookie-parser");

// app.use(cors({ origin: "*" }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      return callback(null, true); // Allow all origins
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/uploads/brands", express.static(__dirname + "/uploads/brands/"));
app.use(
  "/uploads/categories",
  express.static(__dirname + "/uploads/categories/")
);
app.use("/uploads/blogs", express.static(__dirname + "/uploads/blogs/"));
app.use("/api/v1/", Router);

app.get("/", (req, res) => {
  res.send("Welcome to the API 2");
});

const PORT = process.env.PORT;

ConnectMongoDB();

app.listen(PORT, (err) => {
  if (err) return console.log("Server Error! 500");
  console.log(`Server running on port ${PORT}`);
});
