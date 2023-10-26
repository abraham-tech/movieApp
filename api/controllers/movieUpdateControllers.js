require("dotenv").config();
const Movie = require("../data/schemas/moviesModel");


const partialUpdateOne = function (req, res) {
    console.log(process.env.MOVIE_PARTIAL_UPDATE_MESSAGE + req.params.movieId);

    _updateOne(req, res, function (req, res, movie) {
        movieUpdate(req, res, movie, function (response) {
            res.status(response.status).json(response.message);
        });
    });
};

const _updateOne = function (req, res, updateMovieCallback) {
    const movieId = req.params.movieId;

    const response = { status: 0, message: {} };
    Movie.findById(movieId).exec().then(movie => {
        if (!movie) {
            res
                .status(parseInt(process.env.NOT_FOUND_STATUS_CODE))
                .json({ message: process.env.MOVIE_NOT_FOUND });
        } else {
            updateMovieCallback(req, res, movie, response);
        }
    }).catch(err => {
        res
            .status(parseInt(process.env.SERVER_ERROR_STATUS_CODE))
            .json({ [process.env.MESSAGE]: err });
    })
};


const movieUpdate = function (req, res, movie, callback) {
    const updateFields = {};
    if (req.body.title) {
        updateFields.title = req.body.title;
    }
    if (req.body.year) {
        updateFields.year = req.body.year;
    }
    if (req.body.imdbRating) {
        updateFields.imdbRating = req.body.imdbRating;
    }
    if (req.body.awards) {
        updateFields.awards = req.body.awards;
    }
    if (req.body.available != null) {
        updateFields.available = req.body.available;
    }

    movie.set(updateFields);

    const response = { status: 0, message: {} };
    movie.save().then(movie => {
        response.status = parseInt(process.env.OK_STATUS_CODE);
        response.message = movie;

    }).catch(err => {
        response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE);
        response.message = err;

    }).finally(() => {
        console.log(process.env.SUCCESS_FULL_UPDATE_FOR_A_MOVIE + movie._id);
        callback(response);
    })
};


const fullUpdateOne = function (req, res) {
    console.log(process.env.MOVIE_FULL_UPDATE_MESSAGE + req.params.movieId);
    _updateOne(req, res, function (req, res, movie) {
        movieUpdate(req, res, movie, function (response) {
            res.status(response.status).json(response.message);
        });
    });
};


module.exports = {
    fullUpdateOne,
    partialUpdateOne,
};
