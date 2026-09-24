import crypto from "crypto";

import supabase from "../config/supabase.js";

export const uploadDestinationImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const file = req.file;

    const extension = file.originalname.split(".").pop().toLowerCase();

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const filePath = `destinations/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("destination-images")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);

      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
      });
    }

    const { data } = supabase.storage
      .from("destination-images")
      .getPublicUrl(filePath);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        path: filePath,
        image_url: data.publicUrl,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
