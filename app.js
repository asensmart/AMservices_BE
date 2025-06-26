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
const path = require("path");

// Ensure the uploads/categories directory exists
const fs = require("fs");
const categoriesDir = path.join(__dirname, "uploads", "categories");
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
}

app.use(
  "/uploads/categories",
  express.static(path.join(__dirname, "uploads", "categories"), {
    fallthrough: false // Send 404 if file not found
  })
);

app.use("/uploads/blogs", express.static(path.join(__dirname, "uploads", "blogs")));
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
