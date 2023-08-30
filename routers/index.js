const Router = require("express").Router();
const postRouter = require("./postRouter");
const getRouter = require("./getRouter");
const putRouter = require("./updateRouter");
const deleteRouter = require("./deleteRouter");

Router.use("/post/", postRouter);
Router.use("/get/", getRouter);
Router.use("/put", putRouter);
Router.use("/delete", deleteRouter);

module.exports = Router;
