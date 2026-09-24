import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/favoriteService.js";

export const fetchFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await getFavorites(userId);

    return res.status(201).json(favorites);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToFavorite = async (req, res) => {
  try {
    const destinationData = req.body;

    const userId = req.user.id;

    const newFavorite = await addFavorite(destinationData, userId);

    res.status(201).json(newFavorite);
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

export const deleteFromFavorite = async (req, res) => {
  try {
    const { destinationId } = req.params;

    const userId = req.user.id;

    const result = await removeFavorite(destinationId, userId);

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
