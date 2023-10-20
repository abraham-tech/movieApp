require("dotenv").config();
const { response } = require("express");
const Movie = require("../data/schemas/moviesModel");

const _createResponse = (status, message) => {
  return { "status": status, "message": message };
}

const _findMovies = (offset, count) => {
  return Movie.find().skip(offset).limit(count).exec();
};


const _handleSuccess = (response, message) => {
  response.status = parseInt(process.env.OK_STATUS_CODE);
  response.message = message;
};

const _handleError = (response, err) => {
  console.log(err);
  response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
  response.message = err;
};

const _sendResponse = (res, response) => {
  res.status(response.status).json(response.message);
};


const _findMovieById = (movieId) => {
  return Movie.findById(movieId).exec();
}

const _checkIfMovieFound = (movie) => {
  return new Promise((resolve, reject) => {
    if (!movie) {
      reject();
    } else {
      resolve(movie);
    }
  })
}

const _checkIfMovieIsDeleted = (movie) => {
  return new Promise((resolve, reject) => {
    if (!movie) {
      reject();
    } else {
      resolve(movie);
    }
  })
}


const _handleMovieNotFound = (res, response) => {
  response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
  response.message = { [process.env.MESSAGE]: process.env.MOVIE_NOT_FOUND };
  // _sendResponse(res, response)
};

const getAll = function (req, res) {
  const offset = parseInt(req.query.offset) || 0;
  const count = parseInt(req.query.count) || 5;
  const response = _createResponse(process.env.OK_STATUS_CODE, {});

  _findMovies(offset, count)
    .then(movies => _handleSuccess(response, movies))
    .catch(error => _handleError(response, error))
    .finally(() => _sendResponse(res, response))
};

const _createMovie = (newMovie) => {
  return Movie.create(newMovie)
}

const _findMovieByIdAndDelete = (movieId) => {
  return Movie.findByIdAndDelete(movieId).exec();
}

const getOne = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.GET_A_MOVIE_MESSAGE + movieId);
  const response = _createResponse(process.env.OK_STATUS_CODE, {});

  _findMovieById(movieId)
    .then(movie => _checkIfMovieFound(movie))
    .catch(() => _handleMovieNotFound(res, response))
    .then(movie => _handleSuccess(response, movie))
    .catch(error => _handleError(response, error))
    .finally(() => _sendResponse(res, response))
};

const _getMovieFromRequestBody = (req) => {
  return {
    title: req.body.title,
    year: req.body.year,
    imdbRating: req.body.imdbRating,
  }
}


const addOne = function (req, res) {
  const newMovie = _getMovieFromRequestBody(req);
  console.log(process.env.MOVIE_CREATE_MESSAGE + JSON.stringify(newMovie));
  const response = _createResponse(process.env.CREATED_STATUS_CODE, {});

  _createMovie(newMovie)
    .then(movie => _handleSuccess(response, movie))
    .catch(error => _handleError(response, error))
    .finally(() => _sendResponse(res, response));
};


const deleteOne = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.MOVIE_DELETE_MESSAGE + movieId);
  const response = _createResponse(process.env.CREATED_STATUS_CODE, {});

  _findMovieByIdAndDelete(movieId)
    .then(movie => _checkIfMovieIsDeleted(movie))
    .then(movie => _handleSuccess(response, movie))
    .catch(() => _handleMovieNotFound(res, response))
    .catch(error => _handleError(response, error))
    .finally(() => _sendResponse(res, response));
};

module.exports = {
  getAll,
  addOne,
  deleteOne,
  getOne,
};
