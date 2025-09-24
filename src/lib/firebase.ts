'use client';

import {initializeApp, getApp, getApps} from 'firebase/app';
import {getAuth} from 'firebase/auth';

function getEnv(variable: string) {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
  return value;
}

const firebaseConfig = {
  projectId: getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  appId: getEnv('NEXT_PUBLIC_FIREBASE_APP_ID'),
  apiKey: getEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
  messagingSenderId: getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export {app, auth};
