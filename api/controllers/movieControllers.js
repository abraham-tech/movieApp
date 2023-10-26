require("dotenv").config();
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

const _handleError = (err, response) => {
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
  res.status(response.status).json(response.message);
};

const _createMovie = (newMovie) => {
  return Movie.create(newMovie)
}

const _findMovieByIdAndDelete = (movieId) => {
  return Movie.findByIdAndDelete(movieId).exec();
}

const _getMovieFromRequestBody = (req) => {
  return {
    title: req.body.title,
    year: req.body.year,
    imdbRating: req.body.imdbRating,
    available:  req.body.available,
  }
};

const _getQueryStrings = (req) => {
  return { offset: req.query.offset || 0, count: req.query.count || 5 };
};

const getAll = (req, res) => {
  const { offset, count } = _getQueryStrings(req);
  const response = _createResponse(process.env.OK_STATUS_CODE, {});

  _findMovies(offset, count)
    .then(movies => _handleSuccess(response, movies))
    .catch(error => _handleError(error, response))
    .finally(() => _sendResponse(res, response))
};

const _getMovieIdFromRequest = (req) => {
  return req.params.movieId;
}

const getOne = (req, res) => {
  const movieId = _getMovieIdFromRequest(req);
  console.log(process.env.GET_A_MOVIE_MESSAGE + movieId);
  const response = _createResponse(process.env.OK_STATUS_CODE, {});

  _findMovieById(movieId)
    .then(movie => _checkIfMovieFound(movie))
    .catch(() => _handleMovieNotFound(res, response))
    .then(movie => _handleSuccess(response, movie))
    .catch(error => _handleError(error, response))
    .finally(() => _sendResponse(res, response))
};


const addOne = function (req, res) {
  const newMovie = _getMovieFromRequestBody(req);
  console.log(process.env.MOVIE_CREATE_MESSAGE + JSON.stringify(newMovie));
  const response = _createResponse(process.env.CREATED_STATUS_CODE, {});

  _createMovie(newMovie)
    .then(movie => _handleSuccess(response, movie))
    .catch(error => _handleError(error, response))
    .finally(() => _sendResponse(res, response));
};


const deleteOne = function (req, res) {
  const movieId = _getMovieIdFromRequest(req);
  console.log(process.env.MOVIE_DELETE_MESSAGE + movieId);
  const response = _createResponse(process.env.CREATED_STATUS_CODE, {});

  _findMovieByIdAndDelete(movieId)
    .then(movie => _checkIfMovieIsDeleted(movie))
    .then(movie => _handleSuccess(response, movie))
    .catch(() => _handleMovieNotFound(res, response))
    .catch(error => _handleError(error, response))
    .finally(() => _sendResponse(res, response));
};

module.exports = {
  getAll,
  addOne,
  deleteOne,
  getOne,
};
