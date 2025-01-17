const express = require("express");
require("dotenv").config();
const router = require("./api/routes");
require("./api/data/db");

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.use("/api", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  next();
});

app.use("/api", router);

app.use("/", function (req, res) {
  res
    .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
    .json({ [process.env.MESSAGE]: process.env.RESOURSE_NOT_FOUND });
});

const server = app.listen(process.env.PORT, () => {
  console.log(process.env.APP_IS_RUNNING, server.address().port);
});
