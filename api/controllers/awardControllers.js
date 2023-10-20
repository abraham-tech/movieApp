require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("../data/schemas/moviesModel");

const _createResponse = (status, message) => {
  return { "status": status, "message": message };
}

const _getMovieIdFromRequest = (req) => {
  return req.params.movieId;
}

const _getAwardIdFromRequest = (req) => {
  return req.params.awardId;
}

const _findMovieById = (movieId) => {
  return Movie.findById(movieId).exec();
};

const _handleSuccess = (response, message) => {
  response.status = parseInt(process.env.OK_STATUS_CODE);
  response.message = message;
};

const _handleError = (err, response) => {
  response.status = err.status;
  response.message = { "message": err.message };
};

const _checkIfMovieFound = (movie) => {
  return new Promise((resolve, reject) => {
    if (!movie) {
      let error = new Error("Movie not found");

      error.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
      reject(error);
    } else {
      resolve(movie);
    }
  })
};


const _updateAwardToMovie = function (movie, newAward) {
  if (newAward === null) {
    movie.awards = [];
  } else {
    movie.awards = newAward;
  }
  return Movie.findByIdAndUpdate(movie._id, movie, { new: true, overwrite: true })
};


const _getMovieAwards = (movie) => {
  return new Promise((resolve) => {
    resolve(movie?.awards);
  })
};

const _sendResponse = (res, response) => {
  res.status(response.status).json(response.message);
};


const awardGet = function (req, res) {
  const movieId = _getMovieIdFromRequest(req);
  console.log(process.env.LIST_ALL_AWARDS_FOR_AMOVIE_MESSAGE + movieId);
  const response = _createResponse(process.env.OK_STATUS_CODE, {});

  _findMovieById(movieId)
    .then(movie => _checkIfMovieFound(movie))
    .then(movie => _getMovieAwards(movie))
    .then(awards => _handleSuccess(response, awards))
    .catch(error => _handleError(error, response))
    .finally(() => _sendResponse(res, response))
};

const _addAwardToMovie = (movie, award) => {
  movie.awards.push(award);
  return movie.save();
}


const awardAdd = function (req, res) {
  const movieId = _getMovieIdFromRequest(req);
  console.log(process.env.ADD_AWARD_MESSAGE + movieId);
  const response = _createResponse(process.env.OK_STATUS_CODE, {});
  const newAward = {
    name: req.body.name,
    year: req.body.year,
  };

  _findMovieById(movieId)
    .then(movie => _checkIfMovieFound(movie))
    .then(movie => _addAwardToMovie(movie, newAward))
    .then(movie => _handleSuccess(response, movie))
    .catch(error => _handleError(error, response))
    .finally(() => _sendResponse(res, response))

};


const deleteOne = function (req, res) {
  const movieId = req.params.movieId;
  const awardId = req.params.awardId;
  console.log(process.env.DELETE_AWARD_MESSAGE + awardId);

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
  const movieId = _getMovieIdFromRequest(req);
  console.log(process.env.UPDATE_AWARD_MESSAGE + movieId);
  const newAward = {
    name: req.body.name,
    year: req.body.year,
  };
  const response = _createResponse(process.env.OK_STATUS_CODE, {});

  _findMovieById(movieId)
    .then(movie => _checkIfMovieFound(movie))
    .then(movie => _updateAwardToMovie(movie, newAward))
    .then(movie => _handleSuccess(response, movie))
    .catch(error => _handleError(error, response))
    .finally(() => _sendResponse(res, response))
};

const deleteAll = function (req, res) {
  const movieId = _getMovieIdFromRequest(req);
  console.log(process.env.DELETE_ALL_AWARDS_MESSAGE + movieId);
  const response = _createResponse(process.env.OK_STATUS_CODE, {});

  _findMovieById(movieId)
    .then(movie => _checkIfMovieFound(movie))
    .then(movie => _updateAwardToMovie(movie, null))
    .then(movie => _handleSuccess(response, movie))
    .catch(error => _handleError(error, response))
    .finally(() => _sendResponse(res, response))

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



module.exports = {
  awardAdd,
  awardGet,
  deleteOne,
  awardUpdate,
  deleteAll,
};
