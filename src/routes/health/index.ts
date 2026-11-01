import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (_, res) => {
    new SuccessResponse('Success', { timestamp: new Date() }).send(res);
  }),
);

export default router;
