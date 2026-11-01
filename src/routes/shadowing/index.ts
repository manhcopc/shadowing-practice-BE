import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { NotFoundError } from '../../core/ApiError';
import validator, { ValidationSource } from '../../helpers/validator';
import asyncHandler from '../../helpers/asyncHandler';
import schema from './schema';
import TopicRepo from '../../database/repository/TopicRepo';
import PassageRepo from '../../database/repository/PassageRepo';

const router = express.Router();

/**
 * GET /shadowing/topics
 * Returns all active shadowing topics ordered by display order.
 */
router.get(
  '/topics',
  asyncHandler(async (_req, res) => {
    const topics = await TopicRepo.findAllActive();
    return new SuccessResponse('Topics fetched successfully', topics).send(res);
  }),
);

/**
 * GET /shadowing/passages?topic_id=...&level=...
 * Returns published passages filtered by optional topic_id and level.
 */
router.get(
  '/passages',
  validator(schema.passageFilter, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const topicId = req.query.topic_id as string | undefined;
    const level = req.query.level as string | undefined;

    const passages = await PassageRepo.findSummaries({
      topicId,
      level,
    });

    return new SuccessResponse('Passages fetched successfully', passages).send(
      res,
    );
  }),
);

/**
 * GET /shadowing/passages/:id
 * Returns full passage details including ordered sentences.
 */
router.get(
  '/passages/:id',
  validator(schema.passageId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const passageId = String(req.params.id);
    const passage = await PassageRepo.findById(passageId);
    if (!passage) {
      throw new NotFoundError('Passage not found');
    }

    return new SuccessResponse(
      'Passage detail fetched successfully',
      passage,
    ).send(res);
  }),
);

export default router;
