import firestore from '../src/database/firebase';
import TopicRepo from '../src/database/repository/TopicRepo';
import PassageRepo from '../src/database/repository/PassageRepo';
import { SEED_TOPICS, SEED_PASSAGES } from '../src/database/seedData';
import {
  COLLECTION_NAME as API_KEY_COLLECTION,
  Permission,
} from '../src/database/model/ApiKey';

async function seedShadowingData() {
  console.log('🌱 Starting Firestore seed for Shadowing App...');

  // 1. Seed default API Key into Firestore
  const defaultKey = process.env.API_KEY || 'GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj';
  await firestore.collection(API_KEY_COLLECTION).doc('mobile_default_key').set(
    {
      key: defaultKey,
      version: 1,
      permissions: [Permission.GENERAL],
      comments: ['Default API Key for Shadowing Flutter Client'],
      status: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
  console.log('✅ Seeded default API key in collection: api_keys');

  // 2. Seed Topics
  await TopicRepo.upsertMany(SEED_TOPICS);
  console.log(`✅ Seeded ${SEED_TOPICS.length} topics in collection: topics`);

  // 3. Seed Passages
  await PassageRepo.upsertMany(SEED_PASSAGES);
  console.log(
    `✅ Seeded ${SEED_PASSAGES.length} passages in collection: passages`,
  );

  console.log('🎉 Shadowing Firestore seed completed successfully!');
  process.exit(0);
}

seedShadowingData().catch((err) => {
  console.error('❌ Failed to seed Firestore:', err?.message || err);
  process.exit(1);
});
