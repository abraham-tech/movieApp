const mongoose = require("mongoose");
require("./schemas/moviesModel");
require("dotenv").config();

mongoose.connect(process.env.DB_URL, {
});

mongoose.connection.on("connected", function () {
  console.log(process.env.MONGOOSE_CONNECTED_TO_MONGODB_DATABASE);
});

mongoose.connection.on("error", function (error) {
  console.log(process.env.MONGOOSE_CONNECTION_ERROR + error);
});

mongoose.connection.on("disconnected", function () {
  console.log(process.env.MONGOOSE_DISCONNECTED);
});

process.on("SIGINT", function () {
  mongoose.disconnect().then(() => {
    console.info(process.env.MONGOOSE_DISCONNECTED_BY_APP_TERMINATION);
  }).catch(err => {
    console.error(err);
  }).finally(() => {
    process.exit(0);
  })
});
