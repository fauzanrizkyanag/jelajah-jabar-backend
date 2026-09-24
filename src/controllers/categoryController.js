import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService.js";

export const fetchCategories = async (req, res) => {
  try {
    const categories = await getCategories();

    return res.status(201).json(categories);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addCategory = async (req, res) => {
  try {
    const categoryData = req.body;

    const newCategory = await createCategory(categoryData);

    res.status(201).json(newCategory);
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

export const modifyCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryData = req.body;

    const updatedCategory = await updateCategory(id, categoryData);

    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error.message === "PGRST116") {
      return res.status(404).json({
        success: false,
        message: "Category not found",
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

export const removeCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteCategory(id);

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
