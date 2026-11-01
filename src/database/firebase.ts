import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import fs from 'fs';
import Logger from '../core/Logger';

const serviceAccountPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.resolve(__dirname, '../../keys/serviceAccountKey.json');

if (getApps().length === 0) {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, 'utf8'),
    );
    initializeApp({
      credential: cert(serviceAccount),
    });
    Logger.info('Firebase Admin initialized using serviceAccountKey.json');
  } else {
    initializeApp();
    Logger.warn(
      `serviceAccountKey.json not found at ${serviceAccountPath}. Initialized with default credentials.`,
    );
  }
}

export const firestore = getFirestore();
firestore.settings({ ignoreUndefinedProperties: true });

export default firestore;
