import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from "../services/destinationService.js";
import supabase from "../config/supabase.js";

import { deleteDestinationImage } from "../utils/storage.js";

export const fetchDestinations = async (req, res) => {
  try {
    const destinations = await getDestinations(req.query);

    return res.status(201).json(destinations);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchDestinationById = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await getDestinationById(id);

    res.status(200).json(destination);
  } catch (error) {
    if (error.message === "PGRST116") {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addDestination = async (req, res) => {
  try {
    const destinationData = req.body;

    const newDestination = await createDestination(destinationData);

    res.status(201).json(newDestination);
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

export const modifyDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const destinationData = req.body;

    const oldDataDestination = await getDestinationById(id);

    const updatedDestination = await updateDestination(id, destinationData);

    const newImagePath = req.body.image_path;

    if (
      newImagePath &&
      oldDataDestination.data.image_path &&
      newImagePath !== oldDataDestination.data.image_path
    ) {
      await deleteDestinationImage(oldDataDestination.data.image_path);
    }

    res.status(200).json(updatedDestination);
  } catch (error) {
    if (error.message === "PGRST116") {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
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

export const removeDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const dataDestination = await getDestinationById(id);

    const result = await deleteDestination(id);

    if (dataDestination.data.image_path) {
      await deleteDestinationImage(dataDestination.data.image_path);
    }

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

export const getAdminDestinations = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("destinations")
      .select(
        `
          *,
          categories (
            id,
            name,
            slug
          )
        `,
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch destinations",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
