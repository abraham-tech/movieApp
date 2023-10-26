const mongoose = require("mongoose");
require("dotenv").config();
const awardSchema = require("./awardsModel");

const movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  year: Number,
  imdbRating: { type: Number },
  awards: [awardSchema],
  available: { type: Boolean, default: true }
});

// mongoose.model(process.env.MOVIE, movieSchema);
module.exports = mongoose.model(process.env.MOVIE, movieSchema);
