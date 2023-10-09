const callbackify = require("util").callbackify;
require("dotenv").config();
const Movie = require("../data/schemas/moviesModel");

const movieFindLimitSkipExecWithCallback = callbackify(function (
  offset,
  count
) {
  return Movie.find().skip(offset).limit(count).exec();
});

const MovieFindOneWithCallback = callbackify(function (movieId) {
  return Movie.findById(movieId).exec();
});

const DeleteMovieByIdWithCallback = callbackify(function (movieId) {
  return Movie.findByIdAndDelete(movieId).exec();
});

const MovieInsertOneWithCallback = callbackify(function (newMovie) {
  return Movie.create(newMovie);
});

const findByIdAndUpdateWithCallback = callbackify(function (
  id,
  newMovie,
  properties
) {
  return Movie.findByIdAndUpdate(id, newMovie, properties);
});

const findOneAndUpdateWithCallback = callbackify(function (
  id,
  options,
  filter
) {
  return Movie.findOneAndUpdate(id, newMovie, properties);
});

module.exports = {
  findByIdAndUpdateWithCallback,
  MovieInsertOneWithCallback,
  DeleteMovieByIdWithCallback,
  MovieFindOneWithCallback,
  movieFindLimitSkipExecWithCallback,
};
