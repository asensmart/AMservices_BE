require("dotenv").config();
const ConnectMongoDB = require("./config/mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const Router = require("./routers/index.js");
const cookieParser = require("cookie-parser");

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/uploads/brands", express.static(__dirname + "/uploads/brands/"));
app.use("/api/v1/", Router);

const PORT = process.env.PORT;

ConnectMongoDB();

app.listen(PORT, (err) => {
  if (err) return console.log("Server Error! 500");
  console.log(`Server running on port ${PORT}`);
});
