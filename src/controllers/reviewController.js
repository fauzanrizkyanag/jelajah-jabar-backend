import {
  getReviewsByDestination,
  createReview,
  updateReview,
  deleteReview,
} from "../services/reviewService.js";

export const fetchReviewsByDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;

    const reviews = await getReviewsByDestination(destinationId);

    res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addReview = async (req, res) => {
  try {
    const reviewData = req.body;

    const userId = req.user.id;

    const newReview = await createReview(reviewData, userId);

    res.status(201).json(newReview);
  } catch (error) {
    if (error.message === "409") {
      return res.status(409).json({
        success: false,
        message: error.message.cause,
      });
    } else if (error.message === "400") {
      return res.status(400).json({
        success: false,
        message: error.message.cause,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

export const modifyReview = async (req, res) => {
  try {
    const { id } = req.params;

    const reviewData = req.body;

    const userId = req.user.id;

    const updatedReview = await updateReview(id, reviewData, userId);

    res.status(200).json(updatedReview);
  } catch (error) {
    if (error.message === "404") {
      return res.status(404).json({
        success: false,
        message: error.message.cause,
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeReview = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user.id;

    const result = await deleteReview(id, userId);

    res.status(200).json(result);
  } catch (error) {
    if (error.message === "400") {
      return res.status(400).json({
        success: false,
        message: error.message.cause,
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
