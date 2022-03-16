const express= require('express');
const router= express.Router({mergeParams:true});
const catchAsync= require('../utils/catchAsync');
const { isLoggedIn,isReviewAuthor, validateReview } = require('../middleware');
const reviews= require('../controllor/reviews')



router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview));

module.exports=router;