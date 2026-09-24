import supabase from "../config/supabase.js";

export const getDestinations = async (query) => {
  const {
    search,
    category,
    city,
    sort = "newest",
    page = "1",
    limit = "10",
  } = query;

  const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const perPage = Math.min(Math.max(Number.parseInt(limit, 10) || 10, 1), 50);

  const from = (currentPage - 1) * perPage;
  const to = from + perPage - 1;

  let destinationQuery = supabase
    .from("destinations")
    .select(
      `
        id,
        name,
        slug,
        description,
        address,
        city,
        latitude,
        longitude,
        image_url,
        ticket_price,
        opening_time,
        closing_time,
        status,
        created_at,
        updated_at,
        categories (
          id,
          name,
          slug
        ),
        image_path
      `,
      { count: "exact" },
    )
    .eq("status", "PUBLISHED");

  if (search) {
    destinationQuery = destinationQuery.ilike("name", `%${search}%`);
  }

  if (city) {
    destinationQuery = destinationQuery.ilike("city", `%${city}%`);
  }

  if (category) {
    destinationQuery = destinationQuery.eq("category_id", category);
  }

  switch (sort) {
    case "oldest":
      destinationQuery = destinationQuery.order("created_at", {
        ascending: true,
      });
      break;

    case "name_asc":
      destinationQuery = destinationQuery.order("name", {
        ascending: true,
      });
      break;

    case "name_desc":
      destinationQuery = destinationQuery.order("name", {
        ascending: false,
      });
      break;

    default:
      destinationQuery = destinationQuery.order("created_at", {
        ascending: false,
      });
  }

  destinationQuery = destinationQuery.range(from, to);

  const { data: destinations, error, count } = await destinationQuery;

  if (error) throw new Error(error.message);

  const destinationIds = destinations.map((destination) => destination.id);

  let ratings = [];

  if (destinationIds.length > 0) {
    const { data, error: ratingError } = await supabase
      .from("destination_rating_summary")
      .select(
        `
        destination_id,
        average_rating,
        review_count
      `,
      )
      .in("destination_id", destinationIds);

    if (ratingError) {
      throw new Error("Failed to fetch destination ratings");
    }

    ratings = data;
  }

  const ratingMap = new Map(
    ratings.map((rating) => [rating.destination_id, rating]),
  );

  const result = destinations.map((destination) => {
    const rating = ratingMap.get(destination.id);

    return {
      ...destination,
      average_rating: rating ? Number(rating.average_rating) : 0,
      review_count: rating ? rating.review_count : 0,
    };
  });

  return {
    success: true,
    data: result,
    pagination: {
      page: currentPage,
      limit: perPage,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / perPage),
    },
  };
};

export const getDestinationById = async (id) => {
  let destinationByIdQuery = supabase.from("destinations").select(`
    *,
    categories (
      id,
      name,
      slug
    )
  `);

  if (Number.isInteger(Number.parseInt(id))) {
    destinationByIdQuery = destinationByIdQuery.eq("id", id);
  } else {
    destinationByIdQuery = destinationByIdQuery.eq("slug", id);
  }

  destinationByIdQuery = destinationByIdQuery
    .eq("status", "PUBLISHED")
    .single();

  const { data: destination, error } = await destinationByIdQuery;

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error(error.code);
    } else {
      throw new Error(error.message);
    }
  }

  const { data: rating } = await supabase
    .from("destination_rating_summary")
    .select(
      `
      average_rating,
      review_count
    `,
    )
    .eq("destination_id", destination.id)
    .maybeSingle();

  return {
    success: true,
    data: {
      ...destination,
      average_rating: rating ? Number(rating.average_rating) : 0,
      review_count: rating ? rating.review_count : 0,
    },
  };
};

export const createDestination = async (request) => {
  const {
    category_id,
    name,
    slug,
    description,
    address,
    city,
    latitude,
    longitude,
    image_url,
    ticket_price,
    opening_time,
    closing_time,
    status,
    image_path,
  } = request;

  const { data, error } = await supabase
    .from("destinations")
    .insert({
      category_id,
      name,
      slug,
      description,
      address,
      city,
      latitude,
      longitude,
      image_url,
      ticket_price,
      opening_time,
      closing_time,
      status,
      image_path,
    })
    .select()
    .single();

  if (error) {
    throw new Error("400", { cause: error.message });
  }

  return {
    success: true,
    message: "Destination created successfully",
    data,
  };
};

export const updateDestination = async (id, request) => {
  const { data, error } = await supabase
    .from("destinations")
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
    message: "Destination updated successfully",
    data,
  };
};

export const deleteDestination = async (id) => {
  const { error } = await supabase.from("destinations").delete().eq("id", id);

  if (error) {
    throw new Error("400", { cause: error.message });
  }

  return {
    success: true,
    message: "Destination deleted successfully",
  };
};
