import { z } from "zod";

export const createReviewSchema = z.object({
  destination_id: z.number().int().positive(),

  rating: z.number().int().min(1).max(5),

  comment: z.string().min(3).max(1000),
});

export const updateReviewSchema = createReviewSchema.partial();
