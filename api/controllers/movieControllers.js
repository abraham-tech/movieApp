require("dotenv").config();
const Movie = require("../data/schemas/moviesModel");

const getAll = function (req, res) {
  let offset = req.query.offset;
  let count = req.query.count;
  const response = {
    status: parseInt(process.env.OK_STATUS_CODE),
    message: process.env.SUCCESS
  };
  if (isNaN(req.query.offset) || isNaN(req.query.count)) {
    res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({ [process.env.MESSAGE]: process.env.INVALID_COUNT_OR_OFFSET });
    return;
  }
  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, process.env.BASE_TEN);
  }
  if (req.query && req.query.count) {
    offset = parseInt(req.query.count, process.env.BASE_TEN);
  }

  Movie.find().skip(offset).limit(count).exec().then(movies => {
    response.status = parseInt(process.env.OK_STATUS_CODE);
    response.message = movies;

  }).catch(err => {
    response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
    response.message = err;

  }).finally(() => {
    res.status(response.status).json(response.message);
  })
};

const getOne = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.GET_A_MOVIE_MESSAGE + movieId);
  const response = { status: "", message: "" };
  Movie.findById(movieId).exec().then(movie => {
    if (!movie) {
      response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
      response.message = { [process.env.MESSAGE]: process.env.MOVIE_NOT_FOUND };
    } else {
      console.log(process.env.SUCCESS_RETURNED_A_MOVIE + movieId);
      response.status = parseInt(process.env.OK_STATUS_CODE);
      response.message = movie;
    }
  }).catch(err => {
    console.error(err);
    response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
    response.message = process.env.MOVIE_NOT_FOUND;
  }).finally(() => {
    res.status(response.status).json(response.message);
  });
};

const addOne = function (req, res) {
  const newMovie = {
    title: req.body.title,
    year: req.body.year,
    imdbRating: req.body.imdbRating,
  };
  console.log(process.env.MOVIE_CREATE_MESSAGE + JSON.stringify(newMovie));

  const response = { status: "", message: "" };
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
  const response = { status: "", message: "" };
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
