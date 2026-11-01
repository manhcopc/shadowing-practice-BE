import { z } from 'zod';

export default {
  passageFilter: z.object({
    topic_id: z.string().trim().min(1).optional(),
    level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1']).optional(),
  }),
  passageId: z.object({
    id: z.string().trim().min(1, 'Passage ID is required'),
  }),
};
