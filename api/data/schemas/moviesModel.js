const mongoose = require("mongoose");
require("dotenv").config();
const awardSchema = require("./awardsModel");

const movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  year: Number,
  imdbRating: { type: Number, min: 0, max: 10 },
  awards: [awardSchema],
});

mongoose.model("Movie", movieSchema);
// mongoose.model(process.env.MOVIE, movieSchema);
// module.exports = mongoose.model(process.env.MOVIE, movieSchema);
