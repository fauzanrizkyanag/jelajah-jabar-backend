import supabase from "../config/supabase.js";

export const getFavorites = async (userId) => {
  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
        destination_id,
        created_at,
        destination:destinations (
          id,
          name,
          slug,
          city,
          image_url,
          ticket_price
        )
      `,
    )
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw new Error("Failed to fetch favorites");

  return {
    success: true,
    data,
  };
};

export const addFavorite = async (request, userId) => {
  const { destination_id } = request;

  const { data, error } = await supabase
    .from("favorites")
    .insert({
      user_id: userId,
      destination_id,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("409", {
        cause: "Destination already favorited",
      });
    } else {
      throw new Error("400", { cause: error.message });
    }
  }

  return {
    success: true,
    data,
  };
};

export const removeFavorite = async (destinationId, userId) => {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("destination_id", destinationId);

  if (error) {
    throw new Error("400", { cause: error.message });
  }

  return {
    success: true,
    message: "Favorite removed successfully",
  };
};
