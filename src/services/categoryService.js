import supabase from "../config/supabase.js";

export const getCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", {
      ascending: true,
    });

  if (error) throw new Error(error.message);

  return {
    success: true,
    data,
  };
};

export const createCategory = async (request) => {
  const { name, slug, description } = request;

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
      slug,
      description,
    })
    .select()
    .single();

  if (error) {
    throw new Error("400", { cause: error.message });
  }

  return {
    success: true,
    message: "Category created successfully",
    data,
  };
};

export const updateCategory = async (id, request) => {
  const { data, error } = await supabase
    .from("categories")
    .update(request)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error(error.code);
    } else {
      throw new Error("400", { cause: error.message });
    }
  }

  return {
    success: true,
    message: "Category updated successfully",
    data,
  };
};

export const deleteCategory = async (id) => {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    throw new Error("400", { cause: error.message });
  }

  return {
    success: true,
    message: "Category deleted successfully",
  };
};
