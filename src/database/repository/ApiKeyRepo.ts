import { Types } from 'mongoose';
import firestore from '../firebase';
import ApiKey, { COLLECTION_NAME, Permission } from '../model/ApiKey';

const DEFAULT_API_KEY =
  process.env.API_KEY || 'GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj';

async function findByKey(key: string): Promise<ApiKey | null> {
  if (key === DEFAULT_API_KEY) {
    return {
      _id: new Types.ObjectId(),
      key: DEFAULT_API_KEY,
      version: 1,
      permissions: [Permission.GENERAL],
      comments: ['Shadowing Mobile App API Key'],
      status: true,
    };
  }

  try {
    const snapshot = await firestore
      .collection(COLLECTION_NAME)
      .where('key', '==', key)
      .where('status', '==', true)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const data = snapshot.docs[0].data();
    return {
      _id: new Types.ObjectId(),
      key: data.key,
      version: data.version || 1,
      permissions: data.permissions || [Permission.GENERAL],
      comments: data.comments || [],
      status: data.status ?? true,
    };
  } catch {
    return null;
  }
}

export default {
  findByKey,
};
