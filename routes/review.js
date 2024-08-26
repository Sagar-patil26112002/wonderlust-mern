const express = require("express");
const router = express.Router({mergeParams: true}); 
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Review raute
// Reviews - Post Route (create a new review for a listing)
router.post("/",isLoggedIn, reviewController.createReview);

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.deleteReview);

module.exports = router;
