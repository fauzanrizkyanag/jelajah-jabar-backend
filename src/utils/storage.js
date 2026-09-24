import supabase from "../config/supabase.js";

const BUCKET_NAME = "destination-images";

export const deleteDestinationImage = async (imagePath) => {
  if (!imagePath) {
    return;
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([imagePath]);

  if (error) {
    console.error("Failed to delete destination image:", error);
  }
};
