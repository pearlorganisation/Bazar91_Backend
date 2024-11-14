import { asyncHandler } from "../../util/asynchandler.js";
import errorResponse from "../../util/errorResponse.js";
import { ReviewMetaDataModal } from "../Models/reviewMetaData.js";
import { ReviewModel } from "../Models/reviews.js";


// Create a review
export const createReview = asyncHandler(async (req, res, next) => {
  const { productId, reviewBy, reviewHeadline, reviewDescription, reviewStarCount } = req.body;

  // Validate the review data
  if (!productId || !reviewBy || !reviewHeadline || !reviewDescription || reviewStarCount === undefined) {
    return next(new errorResponse("All fields are required", 400));
  }
   

  // Check if the user has already reviewed this product
  const existingReview = await ReviewModel.findOne({ productId, reviewBy });
  if (existingReview) {
    return next(new errorResponse("You have already reviewed this product", 400));
  }

  

    const newReviewMetaData = new ReviewMetaDataModal.create({
      
    })
    const newReview = new ReviewModel({
      productId,
      reviewBy,
      reviewHeadline,
      reviewDescription,
      reviewStarCount
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: newReview
    });

});

// Fetch all reviews for a specific product
export const getReviewsForProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  try {
    const reviews = await ReviewModel.find({ productId })
      .populate('reviewBy', 'name email') // Populating reviewBy with user info (optional)
      .populate('productId', 'productTitle'); // Populating product info (optional)

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for this product"
      });
    }

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    next(new errorResponse("Error fetching reviews", 500));
  }
});

// Fetch a single review by its ID
export const getReviewById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const review = await ReviewModel.findById(id)
      .populate('reviewBy', 'name email') // Populating reviewBy with user info (optional)
      .populate('productId', 'productTitle'); // Populating product info (optional)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    next(new errorResponse("Error fetching review", 500));
  }
});

// Update a review by its ID
export const updateReviewById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { reviewHeadline, reviewDescription, reviewStarCount } = req.body;

  try {
    const updatedReview = await ReviewModel.findByIdAndUpdate(
      id,
      { reviewHeadline, reviewDescription, reviewStarCount },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview
    });
  } catch (error) {
    next(new errorResponse("Error updating review", 500));
  }
});

// Delete a review by its ID
export const deleteReviewById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const review = await ReviewModel.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    await review.remove();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    next(new errorResponse("Error deleting review", 500));
  }
});
