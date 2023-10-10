const express = require("express");
const router = express.Router();
const movieControllers = require("../controllers/movieControllers");
const awardControllers = require("../controllers/awardControllers");
const movieUpdateControllers = require("../controllers/movieUpdateControllers");
const {
  validateIdMiddleware,
  validateIdsMiddleware,
} = require("../controllers/validation");

router.use("/movies/:movieId/awards/:awardId", validateIdsMiddleware);
router.use("/movies/:movieId", validateIdMiddleware);

router
  .route("/movies")
  .get(movieControllers.getAll)
  .post(movieControllers.addOne);

router
  .route("/movies/:movieId")
  .get(movieControllers.getOne)
  .put(movieUpdateControllers.fullUpdateOne)
  .patch(movieUpdateControllers.partialUpdateOne)
  .delete(movieControllers.deleteOne);

router
  .route("/movies/:movieId/awards")
  .get(awardControllers.awardGet)
  .post(awardControllers.awardAdd)
  .put(awardControllers.awardUpdate)
  .delete(awardControllers.deleteAll);

router
  .route("/movies/:movieId/awards/:awardId")
  .delete(awardControllers.deleteOne);

module.exports = router;
