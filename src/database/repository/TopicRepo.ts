import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import firestore from '../firebase';
import Topic, { TOPIC_COLLECTION_NAME } from '../model/Topic';
import { SEED_TOPICS } from '../seedData';
import Logger from '../../core/Logger';

const collection = firestore.collection(TOPIC_COLLECTION_NAME);

async function findAllActive(): Promise<Topic[]> {
  try {
    const snapshot = await collection.where('is_active', '==', true).get();

    if (snapshot.empty) {
      return [...SEED_TOPICS].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    const topics: Topic[] = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data() as Topic;
      return {
        ...data,
        id: data.id || doc.id,
      };
    });

    return topics.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (err) {
    Logger.warn(
      `Firestore query failed in TopicRepo.findAllActive, serving seed fallback: ${err}`,
    );
    return [...SEED_TOPICS].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
}

async function findById(id: string): Promise<Topic | null> {
  try {
    const doc = await collection.doc(id).get();
    if (!doc.exists) {
      return SEED_TOPICS.find((t) => t.id === id) || null;
    }
    const data = doc.data() as Topic;
    return {
      ...data,
      id: data.id || doc.id,
    };
  } catch (err) {
    Logger.warn(
      `Firestore query failed in TopicRepo.findById(${id}), serving seed fallback: ${err}`,
    );
    return SEED_TOPICS.find((t) => t.id === id) || null;
  }
}

async function upsertMany(topics: Topic[]): Promise<void> {
  const batch = firestore.batch();
  const now = new Date().toISOString();

  for (const topic of topics) {
    const ref = collection.doc(topic.id);
    batch.set(
      ref,
      {
        ...topic,
        updated_at: now,
        created_at: topic.created_at || now,
      },
      { merge: true },
    );
  }

  await batch.commit();
}

export default {
  findAllActive,
  findById,
  upsertMany,
};
