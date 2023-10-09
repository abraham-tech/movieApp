const express = require("express");
require("dotenv").config();
const router = require("./api/routes");
require("./api/data/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use("/", function (req, res) {
  res
    .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
    .json({ [process.env.MESSAGE]: process.env.RESOURSE_NOT_FOUND });
});

const server = app.listen(process.env.PORT, () => {
  console.log(process.env.APP_IS_RUNNING, server.address().port);
});
