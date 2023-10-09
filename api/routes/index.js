const express = require("express");
const router = express.Router();
const movieControllers = require("../controllers/movieControllers");
const awardController = require("../controllers/awardControllers");
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
  .put(movieControllers.fullUpdateOne)
  .patch(movieControllers.partialUpdateOne)
  .delete(movieControllers.deleteOne);

router
  .route("/movies/:movieId/awards")
  .get(awardController.awardGet)
  .post(awardController.awardAdd)
  .put(awardController.awardUpdate)
  .delete(awardController.deleteAll);

router
  .route("/movies/:movieId/awards/:awardId")
  .delete(awardController.deleteOne);

module.exports = router;
