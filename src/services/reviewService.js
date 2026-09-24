import supabase from "../config/supabase.js";

export const getReviewsByDestination = async (destination) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
        id,
        rating,
        comment,
        created_at,
        updated_at,
        user:users (
          id,
          name,
          avatar_url
        )
      `,
    )
    .eq("destination_id", destination)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    data,
  };
};

export const createReview = async (request, userId) => {
  const { destination_id, rating, comment } = request;

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      user_id: userId,
      destination_id,
      rating,
      comment,
    })
    .select(
      `
        id,
        rating,
        comment,
        created_at,
        updated_at,
        user:users (
          id,
          name,
          avatar_url
        )
      `,
    )
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("409", {
        cause: "You have already reviewed this destination",
      });
    } else {
      throw new Error("400", { cause: error.message });
    }
  }

  return {
    success: true,
    message: "Review created successfully",
    data,
  };
};

export const updateReview = async (id, request, userId) => {
  const { data, error } = await supabase
    .from("reviews")
    .update(request)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error("404", { cause: error.message });
  }

  return {
    success: true,
    message: "Review updated successfully",
    data,
  };
};

export const deleteReview = async (id, userId) => {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error("400", { cause: error.message });
  }

  return {
    success: true,
    message: "Review deleted successfully",
  };
};
