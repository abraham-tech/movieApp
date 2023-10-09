const mongoose = require("mongoose");
const callbackify = require("util").callbackify;
require("./schemas/moviesModel");
require("dotenv").config();

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

const mongooseGracefulShutdown = callbackify(mongoose.disconnect);

process.on("SIGINT", function () {
  mongooseGracefulShutdown(function (err) {
    if (err) {
      console.error(err);
    }
    console.info(process.env.MONGOOSE_DISCONNECTED_BY_APP_TERMINATION);
    process.exit(0);
  });
});
