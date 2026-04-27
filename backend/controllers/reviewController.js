const Review = require("../models/Review");
const EmergencyRequest = require("../models/EmergencyRequest");
const User = require("../models/User");

/*
  SUBMIT A REVIEW (requester reviews the helper after resolution)
*/

exports.submitReview = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Find the request
    const emergency = await EmergencyRequest.findById(requestId);
    if (!emergency) {
      return res.status(404).json({ message: "Emergency request not found" });
    }

    // Only the requester can review
    if (emergency.requester_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the requester can leave a review" });
    }

    // Must be resolved
    if (emergency.status !== "resolved") {
      return res.status(400).json({ message: "You can only review resolved requests" });
    }

    // Must have a helper
    if (!emergency.accepted_by) {
      return res.status(400).json({ message: "No helper to review" });
    }

    // Check for duplicate review
    const existing = await Review.findOne({ request_id: requestId });
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this request" });
    }

    // Create review
    const review = await Review.create({
      request_id: requestId,
      reviewer_id: req.user.id,
      helper_id: emergency.accepted_by,
      rating,
      comment: comment || ""
    });

    // Recalculate helper's trust_score as average of all their ratings
    const allReviews = await Review.find({ helper_id: emergency.accepted_by });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(emergency.accepted_by, {
      trust_score: Math.round(avgRating * 10) / 10 // round to 1 decimal
    });

    res.status(201).json({
      message: "Review submitted successfully",
      review
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/*
  GET ALL REVIEWS FOR A HELPER
*/

exports.getReviewsForHelper = async (req, res) => {
  try {
    const { helperId } = req.params;

    const reviews = await Review.find({ helper_id: helperId })
      .populate("reviewer_id", "name")
      .populate("request_id", "category")
      .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/*
  GET REVIEW FOR A SPECIFIC REQUEST
*/

exports.getReviewForRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const review = await Review.findOne({ request_id: requestId })
      .populate("reviewer_id", "name")
      .populate("helper_id", "name");

    res.json(review); // null if not found

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
