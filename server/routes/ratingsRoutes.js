const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const User = require("../models/User"); // Import User model
const authenticate = require("../middleware/authMiddleware");

// Create a new review
router.post("/", authenticate, async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;
    const patientId = req.user.id;

    const review = new Review({ doctorId, patientId, rating, comment });
    await review.save();

    const populatedReview = await review.populate("patientId", "name email");

    res
      .status(201)
      .json({ message: "Review added successfully", review: populatedReview });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
});

// Get all reviews for a doctor (including patient details)
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const reviews = await Review.find({ doctorId }).populate(
      "patientId",
      "name email profileImage"
    );
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Get a single review by ID (including patient details)
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      "patientId",
      "name email profileImage"
    );
    if (!review) return res.status(404).json({ error: "Review not found" });

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch review" });
  }
});

// Update a review (only by the user who wrote it)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.patientId.toString() !== req.user.id)
      return res
        .status(403)
        .json({ error: "Unauthorized to update this review" });

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    const updatedReview = await review.populate(
      "patientId",
      "name email profileImage"
    );

    res
      .status(200)
      .json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    res.status(500).json({ error: "Failed to update review" });
  }
});

// Delete a review (only by the user who wrote it)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.patientId.toString() !== req.user.id)
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this review" });

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;
