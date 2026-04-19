import { z } from "zod";

export const createTierSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  totalSlots: z.coerce
    .number()
    .int()
    .min(1, "Capacity must be at least 1"),
  description: z.string().max(500).nullable().optional(),
  benefits: z
    .array(z.string().min(1).max(200))
    .min(1, "Add at least one benefit"),
  sortOrder: z.coerce.number().int().optional(),
});

// .partial() makes all fields optional for partial updates.
// description remains nullable so clearing it in the form sets it to null in the DB.
export const updateTierSchema = createTierSchema.partial();

export type CreateTierInput = z.infer<typeof createTierSchema>;
export type UpdateTierInput = z.infer<typeof updateTierSchema>;
