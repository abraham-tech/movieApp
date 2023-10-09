const mongoose = require("mongoose");
require("dotenv").config();

const awardSchema = mongoose.Schema({
  name: { type: String, required: true },
  year: Number,
});

mongoose.model(process.env.AWARD, awardSchema);
module.exports = awardSchema;
