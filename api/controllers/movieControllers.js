require("dotenv").config();
const { response } = require("express");
const Movie = require("../data/schemas/moviesModel");

const _createResponse = (status, message) => {
  return { "status": status, "message": message };
}

const _findMovies = (offset, count) => {
  return Movie.find().skip(offset).limit(count).exec();
};


const _handleSuccess = (response, movies) => {
  response.status = parseInt(process.env.OK_STATUS_CODE);
  response.message = movies;
};

const _handleError = (err) => {
  console.log(err);
  response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
  response.message = err;
};

const _sendResponse = (res, response) => {
  res.status(response.status).json(response.message);
};

const getAll = function (req, res) {
  const offset = parseInt(req.query.offset) || 0;
  const count = parseInt(req.query.count) || 5;
  const response = _createResponse(process.env.CREATED_STATUS_CODE, {});

  _findMovies(offset, count)
    .then(movies => _handleSuccess(response, movies))
    .catch(error => _handleError(response, error))
    .finally(() => _sendResponse(res, response))
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

const _handleMovieNotFound = (res, response) => {
  response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
  response.message = { [process.env.MESSAGE]: process.env.MOVIE_NOT_FOUND };
  _sendResponse(res, response)
};

const getOne = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.GET_A_MOVIE_MESSAGE + movieId);
  const response = _createResponse(process.env.CREATED_STATUS_CODE, {});

  _findMovieById(movieId)
    .then(movie => _checkIfMovieFound(movie))
    .catch(() => _handleMovieNotFound(res, response))
    .then(movie => _handleSuccess(response, movie))
    .catch(error => _handleError(response, error))
    .finally(() => _sendResponse(res, response))
};


const addOne = function (req, res) {
  const newMovie = {
    title: req.body.title,
    year: req.body.year,
    imdbRating: req.body.imdbRating,
  };
  console.log(process.env.MOVIE_CREATE_MESSAGE + JSON.stringify(newMovie));

  const response = { status: 0, message: {} };
  Movie.create(newMovie).then(movie => {
    response.status = parseInt(process.env.CREATED_STATUS_CODE);
    response.message = movie;
  }).catch(err => {
    console.error(process.env.ERROR_CREATING_MOVIE, err);
    response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE);
    response.message = { message: err }
  }).finally(() => {
    res
      .status(response.status)
      .json(response.message);

  });
};


const deleteOne = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.MOVIE_DELETE_MESSAGE + movieId);
  const response = { status: 0, message: {} };
  Movie.findByIdAndDelete(movieId).exec().then(movie => {
    if (movie === null) {
      response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
      response.message = process.env.MOVIE_NOT_FOUND;
    } else {
      response.status = parseInt(process.env.OK_STATUS_CODE);
      response.message = movie;
    }

  }).catch(err => {
    response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE);
    response.message = err;

  }).finally(() => {
    res
      .status(response.status)
      .json({ [process.env.MESSAGE]: response.message });
  });
};

module.exports = {
  getAll,
  addOne,
  deleteOne,
  getOne,
};
