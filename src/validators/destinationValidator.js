import { z } from "zod";

export const createDestinationSchema = z.object({
  category_id: z.number().int().positive(),

  name: z.string().min(3, "Name must be at least 3 characters").max(150),

  slug: z
    .string()
    .min(3)
    .max(180)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),

  description: z.string().min(10, "Description must be at least 10 characters"),

  address: z.string().min(5),

  city: z.string().min(2).max(100),

  latitude: z.number().min(-90).max(90).nullable().optional(),

  longitude: z.number().min(-180).max(180).nullable().optional(),

  image_url: z.url().nullable().optional(),

  image_path: z.string().nullable().optional(),

  ticket_price: z.number().min(0).default(0),

  opening_time: z.string().nullable().optional(),

  closing_time: z.string().nullable().optional(),

  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const updateDestinationSchema = createDestinationSchema.partial();
