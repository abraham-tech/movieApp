require("dotenv").config();
const mongoose = require("mongoose");
const {
  saveWithCallback,
  findByIdAndUpdateWithCallback,
  MovieInsertOneWithCallback,
  DeleteMovieByIdWithCallback,
  MovieFindOneWithCallback,
  movieFindLimitSkipExecWithCallback,
} = require("./utils");

const getAll = function (req, res) {
  let offset = process.env.DEFAULT_OFFSET;
  let count = process.env.DEFAULT_COUNT;
  console.log(process.env.LIST_ALL_MOVIES_MESSAGE);
  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, process.env.BASE_TEN);
  }
  if (req.query && req.query.count) {
    offset = parseInt(req.query.count, process.env.BASE_TEN);
  }
  movieFindLimitSkipExecWithCallback(offset, count, function (err, movies) {
    if (err) {
      console.error(err);
      res
        .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
        .json({ message: process.env.INTERNAL_SERVER_ERROR });
    }
    console.log(process.env.SUCCESS_RETURNED_MOVIES);
    res.status(parseInt(process.env.OK_STATUS_CODE)).json(movies);
  });
};

const getOne = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.GET_A_MOVIE_MESSAGE + movieId);
  MovieFindOneWithCallback(movieId, function (err, movie) {
    if (movie === null) {
      res
        .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
        .json({ message: process.env.MOVIE_NOT_FOUND });
      return;
    }
    if (err) {
      console.error(err);
      res
        .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
        .json({ message: process.env.MOVIE_NOT_FOUND });
    }
    console.log(process.env.SUCCESS_RETURNED_A_MOVIE + movieId);
    res.status(parseInt(process.env.OK_STATUS_CODE)).json(movie);
  });
};

const addOne = function (req, res) {
  const newMovie = {
    title: req.body.title,
    year: req.body.year,
    imdbRating: req.body.imdbRating,
  };
  console.log(process.env.MOVIE_CREATE_MESSAGE + JSON.stringify(newMovie));

  MovieInsertOneWithCallback(newMovie, function (err, movie) {
    const response = {
      status: process.env.CREATED_STATUS_CODE,
      message: movie,
    };
    if (err) {
      console.error(process.env.ERROR_CREATING_MOVIE, err);
      res
        .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
        .json({ message: process.env.INTERNAL_SERVER_ERROR });
    }
    console.log(process.env.SUCCESS_CREATE_A_MOVIE + movie._id);
    res
      .status(parseInt(process.env.CREATED_STATUS_CODE))
      .json(response.message);
  });
};

const partialUpdateOne = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.MOVIE_PARTIAL_UPDATE_MESSAGE + movieId);
  findByIdAndUpdateWithCallback(
    movieId,
    req.body,
    { new: true },
    (err, movie) => {
      if (err) {
        console.error(err);
        res
          .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
          .json({ message: process.env.INTERNAL_SERVER_ERROR });
      } else if (!movie) {
        res
          .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
          .json({ message: process.env.MOVIE_NOT_FOUND });
      } else {
        console.log(process.env.SUCCESS_PARTIAL_UPDATE_FOR_A_MOVIE + movieId);
        res.status(parseInt(process.env.CREATED_STATUS_CODE)).json(movie);
      }
    }
  );
};

const _updateOne = function (req, res, updateMovieCallback) {
  const movieId = req.params.movieId;
  console.log(process.env.MOVIE_FULL_UPDATE_MESSAGE + movieId);
  MovieFindOneWithCallback(movieId, function (err, movie) {
    const response = { status: 204, message: movie };
    if (err) {
      response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE);
      response.message = err;
    } else if (!movie) {
      response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
      response.message = { message: process.env.MOVIE_NOT_FOUND };
    }
    if (response.status !== 204) {
      res.status(response.status).json(response.message);
    } else {
      updateMovieCallback(req, res, movie, response);
    }
  });
}

const movieUpdate = function (req, res, movie, callback) {
  movie.title = req.body.title;
  movie.year = req.body.year;
  movie.imdbRating = req.body.imdbRating;
  movie.awards = [];
  saveWithCallback(movie, function (err, updatedMovie) {
    const response = {};
    response.status = parseInt(process.env.CREATED_STATUS_CODE);
    response.message = updatedMovie;
    if (err) {
      response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE);
      response.message = err;
    }
    console.log(process.env.SUCCESS_FULL_UPDATE_FOR_A_MOVIE + movie._id);
    callback(response);
  });
};

const fullUpdateOne = function (req, res) {
  _updateOne(req, res, function (req, res, movie) {
    movieUpdate(req, res, movie, function (response) {
      res.status(response.status).json(response.message);
    });
  });
};



// const fullUpdateOne = function (req, res) {
//   const movieId = req.params.movieId;

//   movieUpdate = function (req, res, movie, response) {
//     movie.title = req.body.title;
//     movie.year = req.body.year;
//     movie.imdbRating = req.body.imdbRating;
//     movie.awards = [];
//     saveWithCallback(movie, function (err, updatedMovie) {
//       const response = {}
//       response.status = parseInt(process.env.CREATED_STATUS_CODE);
//       response.message = updatedMovie;
//       if (err) {
//         response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE);
//         response.message = err;
//       }
//       res.status(response.status).json(response.message);
//     });
//   }
//   _updateOne(req, res, movieUpdate);
// }


const fullUpdateOne1 = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.MOVIE_FULL_UPDATE_MESSAGE + movieId);
  const newMovie = {
    title: req.body.title,
    year: req.body.year,
    imdbRating: req.body.imdbRating,
  };

  findByIdAndUpdateWithCallback(
    movieId,
    newMovie,
    { new: true, overwrite: true },
    (err, movie) => {
      if (err) {
        console.error(err);
        res
          .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
          .json({ message: process.env.INTERNAL_SERVER_ERROR });
      } else if (!movie) {
        res
          .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
          .json({ message: process.env.MOVIE_NOT_FOUND });
      } else {
        const response = {
          status: parseInt(process.env.OK_STATUS_CODE),
          message: movie,
        };
        console.log(process.env.SUCCESS_FULL_UPDATE_FOR_A_MOVIE + movieId);
        res
          .status(parseInt(process.env.CREATED_STATUS_CODE))
          .json(response.message);
      }
    }
  );
};

const deleteOne = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.MOVIE_DELETE_MESSAGE + movieId);
  DeleteMovieByIdWithCallback(movieId, function (err, movie) {
    const response = {
      status: parseInt(process.env.OK_STATUS_CODE),
      message: process.env.SUCCESS
    };
    if (movie === null) {
      response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
      response.message = process.env.MOVIE_NOT_FOUND;
    }
    if (err) {

      response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
      response.message = process.env.MOVIE_NOT_FOUND;
    }
    console.log(process.env.SUCCESS_DELETED_A_MOVIE + movieId);
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
  fullUpdateOne,
  partialUpdateOne,
};
