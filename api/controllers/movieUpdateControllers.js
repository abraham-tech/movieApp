require("dotenv").config();
const {
    saveWithCallback,
    MovieFindOneWithCallback
} = require("./utils");


const partialUpdateOne = function (req, res) {
    console.log(process.env.MOVIE_PARTIAL_UPDATE_MESSAGE + req.params.movieId);

    const onResponse = function (response) {
        res.status(response.status).json(response.message);
    };

    _updateOne(req, res, function (req, res, movie) {
        movieUpdate(req, res, movie, function (response) {
            res.status(response.status).json(response.message);
        });
    });
};

const _updateOne = function (req, res, updateMovieCallback) {
    const movieId = req.params.movieId;
    MovieFindOneWithCallback(movieId, function (err, movie) {
        const response = { status: parseInt(process.env.OK_STATUS_CODE), message: movie };
        if (err) {
            response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE);
            response.message = err;
        } else if (!movie) {
            response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
            response.message = { message: process.env.MOVIE_NOT_FOUND };
        }
        if (response.status !== parseInt(process.env.OK_STATUS_CODE)) {
            res.status(response.status).json(response.message);
        } else {
            updateMovieCallback(req, res, movie, response);
        }
    });
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

    movie.set(updateFields);

    saveWithCallback(movie, function (err, updatedMovie) {
        const response = {
            status: parseInt(process.env.OK_STATUS_CODE),
            message: updatedMovie,
        };
        if (err) {
            response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE);
            response.message = err;
        }
        console.log(process.env.SUCCESS_FULL_UPDATE_FOR_A_MOVIE + movie._id);
        callback(response);
    });
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
