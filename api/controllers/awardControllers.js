require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("../data/schemas/moviesModel");

const awardGet = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.LIST_ALL_AWARDS_FOR_AMOVIE_MESSAGE + movieId);
  const response = { status: 0, message: {} };
  Movie.findById(movieId).exec().then(movie => {
    if (!movie) {
      response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE)
      response.message = { message: process.env.MOVIE_NOT_FOUND };
    } else {
      response.status = parseInt(process.env.OK_STATUS_CODE)
      response.message = movie?.awards;
    }
  }).catch(err => {
    response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE)
    response.message = { [process.env.MESSAGE]: err };
  }).finally(() => {
    res
      .status(response.status)
      .json(response.message);
  })
};

const awardAdd = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.ADD_AWARD_MESSAGE + movieId);
  const newAward = {
    name: req.body.name,
    year: req.body.year,
  };
  Movie.findById(movieId).exec().then(movie => {
    if (movie === null) {
      res
        .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
        .json({ message: process.env.MOVIE_NOT_FOUND });
    } else {
      _addAwardToMovie(movie, newAward, res);
    }
  }).catch(err => {
    res
      .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
      .json({ [process.env.MESSAGE]: err });
  })
};

const deleteOne = function (req, res) {
  const movieId = req.params.movieId;
  const awardId = req.params.awardId;
  console.log(process.env.DELETE_AWARD_MESSAGE + awardId);
  console.log("movie id and award id ", movieId, awardId);

  Movie.findById(movieId).exec().then(movie => {
    if (movie === null) {
      res
        .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
        .json({ message: process.env.MOVIE_NOT_FOUND });
    } else {
      _removeAwardFromMovie(movie, awardId, res);
    }
  }).catch(err => {
    res
      .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
      .json({ [process.env.MESSAGE]: err });
  })
};

const awardUpdate = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.UPDATE_AWARD_MESSAGE + movieId);
  const newAward = {
    name: req.body.name,
    year: req.body.year,
  };

  Movie.findById(movieId).exec().then(movie => {
    if (!movie) {
      res
        .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
        .json({ message: process.env.MOVIE_NOT_FOUND });
    } else {
      _updateAwardToMovie(movie, newAward, res);
    }
  }).catch(err => {
    res
      .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
      .json({ [process.env.MESSAGE]: err });
  })
};

const deleteAll = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.DELETE_ALL_AWARDS_MESSAGE + movieId);

  // findMovieAndCallCallback(res, movieId, );

  Movie.findById(movieId).exec().then(movie => {
    if (movie === null) {
      res
        .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
        .json({ message: process.env.MOVIE_NOT_FOUND });
    } else {
      _updateAwardToMovie(movie, null, res);
    }
  }).catch(err => {
    res
      .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
      .json({ [process.env.MESSAGE]: err });
  })
};

const _removeAwardFromMovie = function (movie, awardId, res) {

  const response = { status: 0, message: {} };

  Movie.findByIdAndUpdate(
    { _id: new mongoose.Types.ObjectId(movie._id) },
    { $unset: { "awards.$[elem]": 1 }, new: true },
    { arrayFilters: [{ "elem._id": new mongoose.Types.ObjectId(awardId) }] }).then(movie => {
      response.status = process.env.OK_STATUS_CODE;
      response.message = movie;
    }).catch(err => {
      response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE)
      response.message = { [process.env.MESSAGE]: err };
    }).finally(() => {
      res
        .status(response.status)
        .json(response.message);
    })
};

const _addAwardToMovie = function (movie, newAward, res) {
  movie.awards.push(newAward);
  const response = { status: 0, message: {} };
  Movie.findByIdAndUpdate(movie._id, movie, { new: true, overwrite: true }).then(movie => {
    response.status = process.env.OK_STATUS_CODE;
    response.message = movie;
  }).catch(err => {
    response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE);
    response.message = { message: err }
  }).finally(() => {
    res
      .status(response.status)
      .json(response.message);
  });
};

const _updateAwardToMovie = function (movie, newAward, res) {
  if (newAward === null) {
    movie.awards = [];
  } else {
    movie.awards = newAward;
  }

  const response = { status: 0, message: {} };
  Movie.findByIdAndUpdate(movie._id, movie, { new: true, overwrite: true }).then(movie => {
    response.status = parseInt(process.env.OK_STATUS_CODE)
    response.message = movie;
  }).catch(err => {
    response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE)
    response.message = { [process.env.MESSAGE]: err };
  }).finally(() => {
    res
      .status(response.status)
      .json(response.message);
  })
};

module.exports = {
  awardAdd,
  awardGet,
  deleteOne,
  awardUpdate,
  deleteAll,
};
