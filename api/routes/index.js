const express = require("express");
const router = express.Router();
const movieControllers = require("../controllers/movieControllers");
const awardControllers = require("../controllers/awardControllers");
const movieUpdateControllers = require("../controllers/movieUpdateControllers");
const userControllers = require("../controllers/userControllers");
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


router
  .route("/users/login")
  .post(userControllers.login);
  
router
  .route("/users")
  .post(userControllers.register);



module.exports = router;
