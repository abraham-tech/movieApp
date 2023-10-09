require("dotenv").config();

const isInvalidObjectId = (id) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};

const validateIdMiddleware = (req, res, next) => {
  const movieId = req.params.movieId;

  if (!isInvalidObjectId(movieId)) {
    return res
      .status(parseInt(process.env.BAD_REQUEST_STATUS_CODE))
      .json({ error: process.env.INVALID_ID });
  }
  next();
};

const validateIdsMiddleware = (req, res, next) => {
  const movieId = req.params.movieId;
  const awardId = req.params.awardId;
  if (!isInvalidObjectId(movieId) || !isInvalidObjectId(awardId)) {
    return res
      .status(parseInt(process.env.BAD_REQUEST_STATUS_CODE))
      .json({ error: process.env.INVALID_ID });
  }
  next();
};

module.exports = { validateIdMiddleware, validateIdsMiddleware };
