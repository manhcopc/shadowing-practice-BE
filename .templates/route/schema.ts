import { z } from 'zod';

export default {
  sample: z.object({
    key: z.string().min(1),
  }),
};
