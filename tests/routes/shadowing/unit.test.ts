import '../../database/mock';
import '../../cache/mock';
import { API_KEY } from '../../auth/apikey/mock';
import { SEED_TOPICS, SEED_PASSAGES } from '../../../src/database/seedData';
import app from '../../../src/app';
import supertest from 'supertest';

const mockFindAllActiveTopics = jest.fn(async () => SEED_TOPICS);
const mockFindPassageSummaries = jest.fn(
  async (filter: { topicId?: string; level?: string } = {}) => {
    return SEED_PASSAGES.filter((p) => {
      if (filter.topicId && p.topic_id !== filter.topicId) return false;
      if (filter.level && p.level !== filter.level) return false;
      return true;
    }).map((p) => ({
      ...p,
      sentence_count: p.sentences.length,
    }));
  },
);
const mockFindPassageById = jest.fn(async (id: string) => {
  return SEED_PASSAGES.find((p) => p.id === id) || null;
});

jest.mock('../../../src/database/repository/TopicRepo', () => ({
  findAllActive: () => mockFindAllActiveTopics(),
}));

jest.mock('../../../src/database/repository/PassageRepo', () => ({
  findSummaries: (filter: { topicId?: string; level?: string }) =>
    mockFindPassageSummaries(filter),
  findById: (id: string) => mockFindPassageById(id),
}));

describe('Shadowing API Routes (/v1/shadowing)', () => {
  const request = supertest(app);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /v1/shadowing/topics', () => {
    it('should return 200 and list of active topics', async () => {
      const response = await request
        .get('/v1/shadowing/topics')
        .set('x-api-key', API_KEY);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe('10000');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(SEED_TOPICS.length);
      expect(response.body.data[0].id).toBe('daily_life');
    });
  });

  describe('GET /v1/shadowing/passages', () => {
    it('should return all published passages when no filter is passed', async () => {
      const response = await request
        .get('/v1/shadowing/passages')
        .set('x-api-key', API_KEY);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe('10000');
      expect(response.body.data.length).toBe(SEED_PASSAGES.length);
    });

    it('should filter passages by topic_id and level', async () => {
      const response = await request
        .get('/v1/shadowing/passages?topic_id=daily_life&level=A1')
        .set('x-api-key', API_KEY);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe('pas_coffee_01');
    });

    it('should return 400 when invalid level is passed', async () => {
      const response = await request
        .get('/v1/shadowing/passages?level=INVALID')
        .set('x-api-key', API_KEY);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /v1/shadowing/passages/:id', () => {
    it('should return 200 and full passage with sentences for valid ID', async () => {
      const response = await request
        .get('/v1/shadowing/passages/pas_coffee_01')
        .set('x-api-key', API_KEY);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe('10000');
      expect(response.body.data.id).toBe('pas_coffee_01');
      expect(Array.isArray(response.body.data.sentences)).toBe(true);
      expect(response.body.data.sentences.length).toBeGreaterThan(0);
    });

    it('should return 404 when passage does not exist', async () => {
      const response = await request
        .get('/v1/shadowing/passages/non_existent_id')
        .set('x-api-key', API_KEY);

      expect(response.status).toBe(404);
    });
  });
});
