import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(3).max(100),

  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),

  description: z.string().max(500).optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();
