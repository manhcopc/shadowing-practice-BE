import { Query, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import firestore from '../firebase';
import Passage, {
  PASSAGE_COLLECTION_NAME,
  PassageSummary,
} from '../model/Passage';
import { SEED_PASSAGES } from '../seedData';
import Logger from '../../core/Logger';

const collection = firestore.collection(PASSAGE_COLLECTION_NAME);

export interface PassageFilter {
  topicId?: string;
  level?: string;
}

function toPassageSummary(data: Passage, fallbackId?: string): PassageSummary {
  const sentences = Array.isArray(data.sentences) ? data.sentences : [];
  return {
    id: data.id || fallbackId || '',
    topic_id: data.topic_id,
    title: data.title,
    level: data.level,
    default_wpm: data.default_wpm,
    description: data.description,
    total_words: data.total_words,
    sentence_count: sentences.length,
    sentences,
    is_published: data.is_published,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

function filterFallbackPassages(filter: PassageFilter): PassageSummary[] {
  return SEED_PASSAGES.filter((p) => {
    if (!p.is_published) return false;
    if (filter.topicId && p.topic_id !== filter.topicId) return false;
    if (filter.level && p.level !== filter.level) return false;
    return true;
  })
    .map((p) => toPassageSummary(p))
    .sort((a, b) => a.title.localeCompare(b.title));
}

async function findSummaries(
  filter: PassageFilter = {},
): Promise<PassageSummary[]> {
  try {
    let query: Query = collection.where('is_published', '==', true);

    if (filter.topicId) {
      query = query.where('topic_id', '==', filter.topicId);
    }

    if (filter.level) {
      query = query.where('level', '==', filter.level);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return filterFallbackPassages(filter);
    }

    const passages: PassageSummary[] = snapshot.docs.map(
      (doc: QueryDocumentSnapshot) =>
        toPassageSummary(doc.data() as Passage, doc.id),
    );

    return passages.sort((a, b) => a.title.localeCompare(b.title));
  } catch (err) {
    Logger.warn(
      `Firestore query failed in PassageRepo.findSummaries, serving seed fallback: ${err}`,
    );
    return filterFallbackPassages(filter);
  }
}

async function findById(id: string): Promise<Passage | null> {
  try {
    const doc = await collection.doc(id).get();
    if (!doc.exists) {
      return SEED_PASSAGES.find((p) => p.id === id && p.is_published) || null;
    }
    const data = doc.data() as Passage;
    if (!data.is_published) return null;

    return {
      ...data,
      id: data.id || doc.id,
      sentences: (data.sentences || []).sort((a, b) => a.order - b.order),
    };
  } catch (err) {
    Logger.warn(
      `Firestore query failed in PassageRepo.findById(${id}), serving seed fallback: ${err}`,
    );
    return SEED_PASSAGES.find((p) => p.id === id && p.is_published) || null;
  }
}

async function upsertMany(passages: Passage[]): Promise<void> {
  const batch = firestore.batch();
  const now = new Date().toISOString();

  for (const passage of passages) {
    const ref = collection.doc(passage.id);
    batch.set(
      ref,
      {
        ...passage,
        updated_at: now,
        created_at: passage.created_at || now,
      },
      { merge: true },
    );
  }

  await batch.commit();
}

export default {
  findSummaries,
  findById,
  upsertMany,
};
