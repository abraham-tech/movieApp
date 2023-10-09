require("dotenv").config();
const mongoose = require("mongoose");
const {
  findByIdAndUpdateWithCallback,
  MovieFindOneWithCallback,
} = require("./utils");

const awardGet = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.LIST_ALL_AWARDS_FOR_AMOVIE_MESSAGE + movieId);
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
        .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
        .json({ message: process.env.INTERNAL_SERVER_ERROR });
    }
    console.log(process.env.SUCCESS_RETURNED_AWARDS_FOR_A_MOVIE + movieId);
    res
      .status(parseInt(process.env.OK_STATUS_CODE))
      .json({ [process.env.AWARDS]: movie?.awards });
  });
};

const awardAdd = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.ADD_AWARD_MESSAGE + movieId);
  MovieFindOneWithCallback(movieId, function (err, movie) {
    if (movie === null) {
      res
        .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
        .json({ [process.env.MESSAGE]: process.env.MOVIE_NOT_FOUND });
      return;
    }
    if (err) {
      console.error(err);
      res
        .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
        .json({ [process.env.MESSAGE]: process.env.INTERNAL_SERVER_ERROR });
    } else if (!movie) {
      res
        .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
        .json({ [process.env.MESSAGE]: process.env.MOVIE_NOT_FOUND });
    }

    const newAward = {
      name: req.body.name,
      year: req.body.year,
    };

    _addAwardToMovie(movie, newAward, res);
  });
};

const deleteOne = function (req, res) {
  const movieId = req.params.movieId;
  const awardId = req.params.awardId;
  console.log(process.env.DELETE_AWARD_MESSAGE + awardId);
  console.log("movie id and award id ", movieId, awardId);
  MovieFindOneWithCallback(movieId, function (err, movie) {
    if (err) {
      console.error(err);
      res
        .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
        .json({ [process.env.MESSAGE]: process.env.INTERNAL_SERVER_ERROR });
    } else if (!movie) {
      res
        .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
        .json({ [process.env.MESSAGE]: process.env.MOVIE_NOT_FOUND });
    }

    _removeAwardFromMovie(movie, awardId, res);
  });
};

const awardUpdate = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.UPDATE_AWARD_MESSAGE + movieId);
  MovieFindOneWithCallback(movieId, function (err, movie) {
    if (err) {
      console.error(err);
      res
        .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
        .json({ [process.env.MESSAGE]: process.env.INTERNAL_SERVER_ERROR });
    } else if (!movie) {
      res
        .status(parseInt(process.env.OK_STATUS_CODE))
        .json({ [process.env.MESSAGE]: process.env.MOVIE_NOT_FOUND });
    }

    const newAward = {
      name: req.body.name,
      year: req.body.year,
    };

    _updateAwardToMovie(movie, newAward, res);
  });
};

const deleteAll = function (req, res) {
  const movieId = req.params.movieId;
  console.log(process.env.DELETE_ALL_AWARDS_MESSAGE + movieId);
  MovieFindOneWithCallback(movieId, function (err, movie) {
    if (err) {
      console.error(err);
      res
        .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
        .json({ [process.env.MESSAGE]: process.env.INTERNAL_SERVER_ERROR });
    } else if (!movie) {
      res
        .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
        .json({ [process.env.MESSAGE]: process.env.MOVIE_NOT_FOUND });
    }

    _updateAwardToMovie(movie, null, res);
  });
};

const _removeAwardFromMovie = function (movie, awardId, res) {
  findByIdAndUpdateWithCallback(
    { _id: new mongoose.Types.ObjectId(movie._id) },
    { $unset: { "awards.$[elem]": 1 }, new: true },
    { arrayFilters: [{ "elem._id": new mongoose.Types.ObjectId(awardId) }] },
    function (err, movie) {
      if (err) {
        console.error(err);
        res
          .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
          .json({ [process.env.MESSAGE]: process.env.INTERNAL_SERVER_ERROR });
      } else {
        console.log(process.env.SUCCESS_DELETED_AWARD + awardId);
        res.status(parseInt(process.env.OK_STATUS_CODE)).json(movie);
      }
    }
  );
};

const _addAwardToMovie = function (movie, newAward, res) {
  movie.awards.push(newAward);
  findByIdAndUpdateWithCallback(
    movie._id,
    movie,
    { new: true, overwrite: true },
    function (err, movie) {
      if (movie === null) {
        res
          .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
          .json({ [process.env.MESSAGE]: process.env.MOVIE_NOT_FOUND });
      }
      if (err) {
        console.error(err);
        res
          .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
          .json({ [process.env.MESSAGE]: process.env.INTERNAL_SERVER_ERROR });
      } else {
        console.log(process.env.SUCCESS_ADD_AWARD_TO_MOVIE + movie._id);
        res.status(parseInt(process.env.OK_STATUS_CODE)).json(movie);
      }
    }
  );
};

const _updateAwardToMovie = function (movie, newAward, res) {
  if (newAward === null) {
    movie.awards = [];
  } else {
    movie.awards = newAward;
  }
  findByIdAndUpdateWithCallback(
    movie._id,
    movie,
    { new: true, overwrite: true },
    function (err, movie) {
      if (err) {
        console.error(err);
        res
          .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
          .json({ [process.env.MESSAGE]: process.env.INTERNAL_SERVER_ERROR });
      } else {
        console.log(process.env.SUCCESS_UPDATED_AWARD + movie._id);
        res
          .status(parseInt(process.env.OK_STATUS_CODE))
          .json({ [process.env.MESSAGE]: process.env.SUCCESS });
      }
    }
  );
};

module.exports = {
  awardAdd,
  awardGet,
  deleteOne,
  awardUpdate,
  deleteAll,
};
