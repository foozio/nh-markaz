// DO NOT EDIT, THIS FILE IS MACHINE-GENERATED
'use client';

import {initializeApp, getApp, getApps} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-9753847643-b1026',
  appId: '1:330580492706:web:d84bf7da1b5f79678232fb',
  apiKey: 'AIzaSyANmSRSJiQHYqt_Q7vOK1-4WaCy1HB1Wiw',
  authDomain: 'studio-9753847643-b1026.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '330580492706',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};
