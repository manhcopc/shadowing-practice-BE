import z from 'zod';
import { Header } from '../core/utils';
import { zAuthBearer } from '../helpers/validator';

export default {
  apiKey: z.looseObject({ [Header.API_KEY]: z.string() }),
  auth: z.looseObject({
    authorization: zAuthBearer(),
  }),
};
