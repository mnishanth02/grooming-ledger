import { z } from "zod";

export const TeamSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export type TeamSchemaType = z.infer<typeof TeamSchema>;
